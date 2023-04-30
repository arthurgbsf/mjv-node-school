import { Workout, IWorkout } from "../models/workout.model";
import mongoose from "mongoose";
import {ObjectId} from 'mongoose';

class WorkoutsRepository{

    getAll(userId:string){
        return Workout.find(
            { createdBy: { $ne: userId }}
            ).populate({
                path:'exercises',
                select: '-createdBy -inWorkouts -copiedExerciseId'});
    };

    getAllUser(userId:string){
        return Workout.find(
            { createdBy: { $eq: userId }}
            ).populate({
                path:'exercises',
                select: '-createdBy -inWorkouts -copiedExerciseId'});
    };
    
    getById(id:string){
        return Workout.findById({_id:id}).populate({
            path:'exercises',
            select: '-createdBy -inWorkouts -copiedExerciseId'});
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

