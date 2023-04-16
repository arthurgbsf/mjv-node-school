import mongoose, { Schema, ObjectId } from "mongoose";

export interface IUser{
    id?: ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date | string;
    UpdatedAt: Date | string;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    UpdatedAt: {
        type: Date,
        default: new Date()
    }
});

export const User = mongoose.model('User',userSchema);  