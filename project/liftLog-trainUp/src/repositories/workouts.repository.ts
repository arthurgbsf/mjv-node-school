import { Workout, IWorkout } from "../models/workout.model";
import {ObjectId} from 'mongoose';

class WorkoutsRepository{

    getAll(){
        return Workout.find();
    };

    getById(id:string){
        return Workout.findById({_id:id});
    };

    create(workout:IWorkout){
        return Workout.create(workout);
    };

    update(id: string, workout:Partial<IWorkout>){
        return Workout.updateOne({_id:id}, {$set:workout});
    };

    remove(id: string){
        return Workout.deleteOne({_id:id});
    }

    removeExercise(workoutId: ObjectId, exerciseId: string){
        return Workout.updateOne({id:workoutId}, {$pull: {exercises: exerciseId}});
    }


};

export default new WorkoutsRepository;

