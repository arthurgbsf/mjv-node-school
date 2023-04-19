import mongoose,  { ObjectId, Schema} from "mongoose";
import moment from "moment";

export interface IWorkout{
    _id?: ObjectId;
    workout: string;
    level: string;
    duration:string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date | string;
    updatedAt: Date | string;
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
      type: mongoose.Schema.Types.ObjectId,
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
    duration:{
      type: String,
      required: true
    }

},{toJSON: { getters: true}}
);

export const Workout = mongoose.model('Workout', workoutSchema);