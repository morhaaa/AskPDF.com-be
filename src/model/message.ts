import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  text: string;
  isUserMessage: boolean;
  createdAt: Date;
  userId: mongoose.Types.ObjectId;
  fileId: mongoose.Types.ObjectId;
}

const MessageSchema: Schema = new Schema({
  text: { type: String, required: true },
  isUserMessage: { type: Boolean, required: true },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileId: { type: Schema.Types.ObjectId, ref: "File", required: true },
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
