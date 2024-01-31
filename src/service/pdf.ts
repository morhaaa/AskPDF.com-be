import FileModel, { IFile } from "../model/file";

export class PdfService {
    public async getFilesByUserId(user_id: string): Promise<IFile[]> {
        try {
          const files = await FileModel.find({ userId: user_id }).exec();
      
          if (files.length === 0) {
            return [];
          }
      
          return files;
        } catch (error) {
          console.error("Error:", error);
          throw new Error("Something went wrong");
        }
      }
      
    public async getFileById(fileId: string): Promise<IFile | null> {
        try {
          const file = await FileModel.findById(fileId).exec();
      
          if (!file) {
            return null;
          }
      
          return file;
        } catch (error) {

          console.error("Error:", error);
          throw new Error("Something went wrong");
        }
      }

    public async createFile ( fileData: Partial<IFile>): Promise<IFile> {
        try {
          const newFile = new FileModel(fileData);
          const savedFile = await newFile.save();
          return savedFile;
        } catch (error) {
          console.error("Error:", error);
          throw new Error("Something went wrong");
        }
        
      };

      public async deleteFileById(fileId: string): Promise<IFile> {
        try {
          const deletedFile = await FileModel.findByIdAndDelete(fileId).exec();
      
          if (!deletedFile) {
            throw new Error('File not found');
          }
      
          console.log('File deleted');
          return deletedFile
          
        } catch (error) {
          console.error('Error:', error);
          throw new Error('Errore');
        }
      }
      

  }
  