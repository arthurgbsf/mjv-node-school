import mongoose, { Schema, ObjectId, Types} from "mongoose";
import moment from "moment";

export interface IUser{ 
    id?: ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    myCreatedWorkouts?: Array<ObjectId>;
    myCreatedExercises?: Array<ObjectId>;
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
        get: (createdAt:Date) => moment(createdAt).locale('pt-br').format('L [às] LTS ')

    },
    updatedAt: {
        type: String,
        required:false
        
    },
    myCreatedWorkouts:[{
        type: Types.ObjectId,
        ref: 'Workout',
        required: false
    }],

    myCreatedExercises:[{
        type: Types.ObjectId,
        ref: 'Exercise',
        required: false
    }]
},
    {toJSON: { getters: true, virtuals: false},
    versionKey: false
});

export const User = mongoose.model('User', userSchema);  