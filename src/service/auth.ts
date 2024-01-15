import bcrypt from "bcryptjs";
import User, { IUser } from "../model/user";

export class AuthService {
  public async getUser(email: string, password: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email }).exec();

      if (!user) {
        return null;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      return isPasswordMatch ? user : null;
    } catch (error) {
      throw error;
    }
  }

  public async getUserById(_id:string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ _id }).exec();

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
