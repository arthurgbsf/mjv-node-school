import mongoose,  { ObjectId, Schema} from "mongoose";
import moment from "moment";

export interface IExercise{
    _id?: ObjectId;
    exercise: string;
    sets: number;
    reps: number;
    type: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date | string;
    updatedAt: Date | string;
    copiedFrom: mongoose.Types.ObjectId;
    inWorkouts?: Array<ObjectId>;
}   

export const exerciseSchema = new Schema<IExercise>({
    exercise: {
        type: String,
        required: true
      },
    sets:{
        type: Number,
        required: true
      },
    reps:{
        type: Number,
        required: true
      },
    type:{
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
    copiedFrom:{
      type:  mongoose.Schema.Types.ObjectId,
      required: false
    },
    inWorkouts:[
      {type: mongoose.Schema.Types.ObjectId
      }
    ]

},{toJSON: { getters: true}}
);

export const Exercise = mongoose.model('Exercise', exerciseSchema);