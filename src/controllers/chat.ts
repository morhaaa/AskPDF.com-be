import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Request, Response } from "express";
import { PdfService } from "../service/pdf";
import { IFile } from "../model/file";
import OpenAI from "openai";
import { MessageService } from "../service/messages";
import { IMessage } from "../model/message";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

class ChatController {
  private pdfService: PdfService;
  private messageService: MessageService;

  constructor() {
    this.pdfService = new PdfService();
    this.messageService = new MessageService();
  }
  /*ENG:
    Pinecone is a Vector Database, it transforms data into arrays. Example [0.2, 5.3, 13, etc].
    This type of database is useful for storing complex data such as images, audio, scientific data, etc.
    These databases are widely used in LLM applications. */

  /*IT:
    Pinecone è un DB Vettoriale, trasforma i dati in array. Esempio [0.2, 5.3, 13, ecc].
    Questo tipo di DB è utile per memorizzare dati complessi come immagini, audio, dati scientifici, ecc.
    Questi DB sono molto utilizzati nei LLM. */

  private pc = new Pinecone();
  private pineconeIndex = this.pc.Index(process.env.PINECONE_INDEX || "");
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  private async getPdf(file_id: string): Promise<IFile | null> {
    try {
      const file = await this.pdfService.getFileById(file_id);

      return file;
    } catch (error) {
      console.error(error);
      throw new Error("error");
    }
  }

  private async getPrevMessages(file_id: string): Promise<IMessage[]> {
    try {
      const messages = await this.messageService.getPrevMessages(file_id);

      return messages;
    } catch (error) {
      console.error(error);
      throw new Error("error");
    }
  }

  //Get user id from jwt
  private getUserId = (token: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string,
        (err: any, decoded: any) => {
          if (err) {
            reject({ message: "Token invalid", success: false });
          } else {
            resolve(decoded.user_id);
          }
        }
      );
    });
  };

  public async streamResponse(req: Request, res: Response): Promise<void> {
    const { message, file_id } = req.body;
    const io = req.app.get("socket.io");
    const token = req.cookies.jwt_token;
    const user_id = await this.getUserId(token);
    const pdf = await this.getPdf(file_id);

    if (pdf) {
      //Save user message to db
      const userMessage = {
        text: message,
        isUserMessage: true,
        createdAt: new Date(),
        userId: new ObjectId(user_id),
        fileId: new ObjectId(file_id),
      };

      await this.messageService.createMessage(userMessage);

      // Fetch PDF form Firebase
      const response = await fetch(pdf.url);

      //Blob the PDF
      const blob = await response.blob();

      /* 
      ------- LANG CHAIN -----
        LangChain is a framework that lets software developers working with artificial intelligence AI 
        and its machine learning subset combine large language models with other external components 
        to develop LLM-powered applications. The goal of LangChain is to link powerful LLMs, such as OpenAI's GPT-4,
        to an array of external data sources to create and reap the benefits of natural language processing (NLP) applications.
     */

      const loader = new PDFLoader(blob);

      const pageLevelDocs = await loader.load();

      //vectorize and index entire document
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY || "",
      });

      const vectorStores = await PineconeStore.fromDocuments(
        pageLevelDocs,
        embeddings,
        {
          pineconeIndex: this.pineconeIndex,
          namespace: pdf.id,
        }
      );

      const results = await vectorStores.similaritySearch(message, 4);

      //Get last 6 messages from MongoDB
      const prevMessages = await this.getPrevMessages(file_id);

      // Format last messages for openAI
      const formattedPrevMessages = prevMessages.map((msg) => ({
        role: msg.isUserMessage ? "user" : "assistant",
        content: msg.text,
      }));

      const stream = await this.openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
          },
          {
            role: "user",
            content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
              
        \n----------------\n
        
        PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
          if (message.role === "user") return `User: ${message.content}\n`;
          return `Assistant: ${message.content}\n`;
        })}
        
        \n----------------\n
        
        CONTEXT:
        ${results.map((r) => r.pageContent).join("\n\n")}
        
        USER INPUT: ${message}`,
          },
        ],
      });
      let openAIResponse = "";
      for await (const part of stream) {
        const chunk = part.choices[0]?.delta?.content || "";
        openAIResponse += chunk;
        io.emit("openAIResponseStarted", chunk);
      }

      //Save openAo response
      const streamedMessage = {
        text: openAIResponse,
        isUserMessage: false,
        createdAt: new Date(),
        userId: new ObjectId(user_id),
        fileId: new ObjectId(file_id),
      };

      io.emit("openAIResponseComplete");
      await this.messageService.createMessage(streamedMessage);

      res.end();
    } else {
      res.status(404).json({
        status: 404,
        success: true,
        message: "PDF not found",
      });
    }
  }

  //Get messages by file Id
  public async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { file_id } = req.body;
      const messages = await this.messageService.getPrevMessages(file_id);

      res.status(200).json({
        status: 200,
        success: true,
        message: "Success",
        messages: messages,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  }
}

export default ChatController;
