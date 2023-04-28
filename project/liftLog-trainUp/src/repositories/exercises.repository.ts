import { Exercise, IExercise } from "../models/exercise.model";
import mongoose, { ObjectId } from "mongoose";

class ExercisesRepository{

    getAll(userId: string){
        return Exercise.find({ copiedExerciseId: { $exists: false },  createdBy: { $ne: userId }}, {inWorkouts:0});
    };

    getAllUser(userId: string){
        return Exercise.find({ createdBy: { $eq: userId }});
    };

    getById(id:string){
        return Exercise.findById({_id:id});
    };

    create(exercise:IExercise){
        return Exercise.create(exercise);
    };

    update(id: string, exercise:Partial<IExercise>){
        return Exercise.updateOne({_id:id}, {$set:exercise});
    };

    remove(id: string){
        return Exercise.deleteOne({_id:id});
    }

    addInWorkout(exerciseId: mongoose.Types.ObjectId, workoutId: ObjectId |  mongoose.Types.ObjectId) {
        return Exercise.updateOne({_id: exerciseId}, {$push: {inWorkouts: workoutId}});
    }

    removeInWorkout(exerciseId: mongoose.Types.ObjectId, workoutId: ObjectId | mongoose.Types.ObjectId) {
        return Exercise.updateOne({_id: exerciseId}, {$pull: {inWorkouts: workoutId}});
    }

};

export default new ExercisesRepository;

