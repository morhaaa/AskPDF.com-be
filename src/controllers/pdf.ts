import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { PdfService } from "../service/pdf";
import { ObjectId } from "mongodb";

class PdfController {
  private pdfService: PdfService;

  constructor() {
    this.pdfService = new PdfService();
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

  //Get all file of a single user
  public getAllFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies.jwt_token;

      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user_id = await this.getUserId(token);
      const files = await this.pdfService.getFilesByUserId(user_id);

      if (!files) {
        res.status(401).json({ message: "Error", success: false });
        return;
      }

      res.status(200).json({
        status: 200,
        success: true,
        message: "success",
        files: files,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  //Get a file by Id
  public getFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const file_id = req.params.pdf_id;
      const file = await this.pdfService.getFileById(file_id);

      if (!file) {
        res.status(404).json({ message: "File not found", success: false });
      }

      res.status(200).json({
        status: 200,
        success: true,
        message: "Success",
        file: file,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
  };

  //Create file data in Mongo DB
  public createFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies.jwt_token;
      const body = req.body;

      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user_id = await this.getUserId(token);

      const fileData = {
        name: body.name,
        url: body.url,
        size: body.size,
        createAt: body.createAt,
        updateAt: body.updateAt,
        userId: new ObjectId(user_id),
      };

      const fileCreated = await this.pdfService.createFile(fileData);

      if (!fileCreated) {
        res.status(401).json({ message: "Error", success: false });
      }

      res.status(200).json({
        status: 200,
        success: true,
        message: "success",
        file: fileCreated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  //Delete File data from db
  public deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const file_id = req.params.pdf_id;

      const fileDeleted = await this.pdfService.deleteFileById(file_id);

      if (!fileDeleted) {
        res.status(401).json({ message: "Error", success: false });
      }

      res.status(200).json({
        status: 200,
        success: true,
        message: "File deleted success",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default PdfController;
