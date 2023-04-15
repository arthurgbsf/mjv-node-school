import mongoose, {ObjectId, Schema} from 'mongoose';

export interface IUser{
    _id?: ObjectId;
    name: string;
    email:string;
    password:string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type : Date,
        default: new Date()
    }
});

export const User = mongoose.model('User', userSchema);


