import mongoose, { Document, Schema } from "mongoose";

export interface IFile extends Document {
    name: string;
    url: string;
    createAt: Date;
    updateAt: Date;
    userId: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<IFile>({
    name: { type: String, required: true },
    url: { type: String, required: true },
    createAt: { type: Date, required: true },
    updateAt: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const FileModel = mongoose.model<IFile>('File', fileSchema);

export default FileModel;
