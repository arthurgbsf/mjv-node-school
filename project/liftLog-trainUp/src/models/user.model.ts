import mongoose, { Schema, ObjectId, Types, HydratedDocument} from "mongoose";
import { IWorkout } from "./workout.model";
import moment from "moment";

export interface IUser{ 
    id?: ObjectId;
    name: string;
    email: string;
    password: string;
    dateOfBirth?: string;
    height?:number;
    weight?:number;
    createdAt: Date | string;
    updatedAt: Date | string;
    imc?: number;
    age?: string;
    userWorkout?: HydratedDocument<IWorkout>;
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
        type: Date,
        default: new Date(),
        get: (createdAt:Date) => moment(createdAt).locale('pt-br').format('L [às] LTS ')

    },
    updatedAt: {
        type: Date,
        required:false,
        get: (updatedAt:Date) => moment(updatedAt).locale('pt-br').format('L [às] LTS ')
        
    },
    dateOfBirth: {type: String,
        required: false
    },
    height: { type: Number,
    required: false
    },
    weight: {type: Number,
    required: false
    },
    age:{type: String,
        required: false,
    },
    imc:{type: Number,
        required: false
    },
    userWorkout:{
        type: Types.ObjectId,
        ref: 'Workout'
    }
},
    {toJSON: { getters: true}
});

export const User = mongoose.model('User', userSchema);  