import bcrypt from "bcryptjs";
import User, { IUser } from "../model/user";

const SALT_ROUNDS = 10;

export class UserService {
    public async getUser(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async createUser(userData: IUser): Promise<IUser> {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
            const newUser = new User({...userData, password: hashedPassword});
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            throw error;
        }
    }

    public async updateUser(userId: string, updatedUserData: IUser): Promise<IUser | null> {
        try {
            if (updatedUserData.password) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, SALT_ROUNDS);
            }

            const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    public async deleteUser(userId: string): Promise<void> {
        try {
            await User.findByIdAndDelete(userId);
        } catch (error) {
            throw error;
        }
    }
}
