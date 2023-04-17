import mongoose,  { ObjectId, Schema, HydratedDocument, Types} from "mongoose";
import { IExercise} from "./exercise.model";
import moment from "moment";

export interface IWorkout{
    _id?: ObjectId;
    workout: string;
    level: string;
    createdBy: ObjectId;
    createdAt: Date | string;
    updatedAt: Date | string;
    exercise?: Array<HydratedDocument<IExercise>>;
}

export const workoutSchema = new Schema<IWorkout>({
    workout: {
        type: String,
        required: true
      },
    level:{
        type: String,
        required: true
      },

    createdBy:{
      type: Types.ObjectId,
      ref: 'User',
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
    exercise:[{
        type: Types.ObjectId,
        ref: 'Exercise',
        required:false
      }]
});

export const Workout = mongoose.model('Workout', workoutSchema);