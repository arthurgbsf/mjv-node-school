import { IWorkout } from "../models/workout.model";
import ExercisesService from "../services/exercises.service";
import { IExercise } from "../models/exercise.model";

export async function copyWorkoutExercises(workout: IWorkout, headers: string | undefined){

    
    const exercisesId = workout.exercises.map(async (exerciseId) => {
            const exercise: IExercise =  await ExercisesService.copy(headers,exerciseId.toString());
            return exercise._id;
    });
    return exercisesId;
};