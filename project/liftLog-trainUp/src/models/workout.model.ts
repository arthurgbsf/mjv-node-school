import mongoose,  { ObjectId, Schema} from "mongoose";
import moment from "moment";

export interface IWorkout{
    _id?: ObjectId;
    workout: string;
    level?: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    exercises: Array<mongoose.Types.ObjectId>;
    copiedWorkoutId?: mongoose.Types.ObjectId;
};   

export const workoutSchema = new Schema<IWorkout>({
    workout: {
        type: String,
        required: true
      },
    level:{
        type: String,
        required: false
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
        type: String,
        required:false
    },
    copiedWorkoutId:{
      type: mongoose.Types.ObjectId,
      required: false
    },

    exercises:[{
      type: mongoose.Types.ObjectId,
      ref: 'Exercise'
    }]

  },
  {toJSON: { getters: true, virtuals: false},
  versionKey: false
});

export const Workout = mongoose.model('Workout', workoutSchema);