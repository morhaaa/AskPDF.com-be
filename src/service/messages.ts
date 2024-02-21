import MessageModel, { IMessage } from "../model/message";

export class MessageService {
  public async getPrevMessages(fileId: string): Promise<IMessage[]> {
    try {
      const prevMessages = await MessageModel.find({
        fileId: fileId,
      })
        .sort({ createdAt: -1 })
        .limit(6);

      const sortedMessages = prevMessages.reverse();
      return sortedMessages;
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

  public async loadOldMessages(
    fileId: string,
    createdAt: Date
  ): Promise<IMessage[]> {
    try {
      const pageSize = 8;

      const prevMessages = await MessageModel.find({
        fileId: fileId,
        createdAt: { $lt: createdAt },
      })
        .sort({ createdAt: -1 })
        .limit(pageSize);

      const sortedMessages = prevMessages.reverse();

      return sortedMessages;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  public async checkIfMessagesAvailable(
    fileId: string,
    createdAt: Date
  ): Promise<boolean> {
    try {
      const prevMessagesCount = await MessageModel.countDocuments({
        fileId: fileId,
        createdAt: { $lt: createdAt },
      });

      return prevMessagesCount > 0;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
