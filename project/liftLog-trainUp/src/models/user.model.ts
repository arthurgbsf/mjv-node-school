import mongoose, { Schema, ObjectId, Types} from "mongoose";
import moment from "moment";

export interface IUser{ 
    id?: ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    myCreatedWorkouts?: Array<ObjectId>;
}

export const userSchema = new Schema<IUser>({
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
        required:false,
        type: Date,
        default: new Date(),
        get: (createdAt:Date) => moment(createdAt).locale('pt-br').format('L [às] LTS ')

    },
    updatedAt: {
        type: Date,
        required:false,
        get: (updatedAt:Date) => moment(updatedAt).locale('pt-br').format('L [às] LTS ')
        
    },
    myCreatedWorkouts:[{
        type: Types.ObjectId,
        ref: 'Workout',
        required: false
    }]
},
    {toJSON: { getters: true}
});

export const User = mongoose.model('User', userSchema);  