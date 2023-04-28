import { Workout, IWorkout } from "../models/workout.model";
import mongoose from "mongoose";
import {ObjectId} from 'mongoose';

class WorkoutsRepository{

    getAll(userId:string){
        return Workout.find(
            { copiedFrom: { $exists: false },  createdBy: { $ne: userId }}
            ).populate('exercises');
    };

    getAllUser(userId:string){
        return Workout.find(
            { createdBy: { $eq: userId }}
            ).populate('exercises');
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

    removeExercise(workoutId: ObjectId, exerciseId:  mongoose.Types.ObjectId){
        return Workout.updateOne({id:workoutId}, {$pull: {exercises: exerciseId}});
    }


};

export default new WorkoutsRepository;

