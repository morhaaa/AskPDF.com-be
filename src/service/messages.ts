import MessageModel, { IMessage } from "../model/message";

export class MessageService {
  public async getPrevMessages(fileId: string): Promise<IMessage[]> {
    try {
      const prevMessages = await MessageModel.find({
        fileId: fileId,
      })
        .sort({ createdAt: "asc" })
        .limit(6);

      return prevMessages;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  public async createMessage(newMessage: Partial<IMessage>): Promise<IMessage> {
    try {
      const createdMessage = await new MessageModel(newMessage).save();
      return createdMessage;
    } catch (error) {
      throw new Error(`Error creating message: ${error}`);
    }
  }
}
