
import { ObjectId } from "mongoose";
import { IWorkout } from "../models/workout.model";
import ExercisesRepository from "../repositories/exercises.repository";
import { CustomError } from "./customError.util";

export async function removeRefWorkoutInExercise(workout: IWorkout){

    const workoutId: (ObjectId | undefined) = workout._id
    if (workoutId === undefined) {
        throw new CustomError("Workout not found", 404);
    };

    for( const exerciseId of  workout.exercises){
        await ExercisesRepository.removeInWorkout(exerciseId,workoutId)
    }
    
}