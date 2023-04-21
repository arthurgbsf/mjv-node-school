import { Exercise, IExercise } from "../models/exercise.model";
import mongoose, { ObjectId } from "mongoose";

class ExercisesRepository{

    getAll(){
        return Exercise.find();
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

    addInWorkout(exerciseId: mongoose.Types.ObjectId, workoutId: ObjectId) {
        return Exercise.updateOne({_id: exerciseId}, {$push: {inWorkouts: workoutId}});
    }
};

export default new ExercisesRepository;

