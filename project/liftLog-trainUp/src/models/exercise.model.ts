import mongoose, { ObjectId, Schema } from "mongoose";
import moment from "moment";

export interface IExercise{
    _id?: ObjectId;
    exercise: string;
    sets: number;
    reps: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export const ExerciseSchema = new Schema<IExercise>({
    exercise: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
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
        
    }
},
    {toJSON: { getters: true}
});

export const Exercise = mongoose.model('Exercise', ExerciseSchema);  