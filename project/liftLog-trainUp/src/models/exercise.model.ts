import mongoose,  { ObjectId, Schema} from "mongoose";
import moment from "moment";

export interface IExercise{
    _id?: ObjectId;
    exercise: string;
    sets: string;
    reps: string;
    type: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    copiedExerciseId?: mongoose.Types.ObjectId;
    inWorkouts?: Array<ObjectId>;
}   

export const exerciseSchema = new Schema<IExercise>({
    exercise: {
        type: String,
        required: true
      },
    sets:{
        type: String,
        required: true
      },
    reps:{
        type: String,
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
        required: false,
        get: (createdAt:Date) => moment(createdAt).locale('pt-br').format('L [às] LTS ')

    },
    updatedAt: {
        type: String,
        required:false
    },
    copiedExerciseId:{
      type:  mongoose.Schema.Types.ObjectId,
      required: false
    },
    inWorkouts:[
      {type: mongoose.Schema.Types.ObjectId
      }
    ]

  },
  {toJSON: { getters: true, virtuals: false},
  versionKey: false
});

export const Exercise = mongoose.model('Exercise', exerciseSchema);