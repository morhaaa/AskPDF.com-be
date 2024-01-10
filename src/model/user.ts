import mongoose, { Schema } from "mongoose"


export interface IUser {
    email: string;
    userName: string;
    memberShip: string;
    role: 'user'|'admin';
    password: string
}

const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        required: [true,'Please provide your email'] , 
        lowercase: true,
        timestamps: true,
        },
    username: { 
        type: String, 
        unique: true, 
        required: [true,'Please insert a username']
        },
    memberShip: {
        type: String,
        lowercase: true,
        default: 'notMembership'
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true,'Please provide your password']
    }
});

const User = mongoose.models.User<IUser> || mongoose.model<IUser>("User", userSchema);

export default User;