import { CustomError } from "./customError.util";
import { IWorkout } from "../models/workout.model";
import ExercisesRepository from "../repositories/exercises.repository";
import { ObjectId } from "mongoose";

export async function setRefWorkoutInExercise(workout: IWorkout){

    const workoutId: (ObjectId | undefined) = workout._id
    if (workoutId === undefined) {
        throw new CustomError("Workout not found.", 404);
    };

    for( const exerciseId of  workout.exercises){
        await ExercisesRepository.addInWorkout(exerciseId,workoutId)
    }
    
    return workoutId;
}