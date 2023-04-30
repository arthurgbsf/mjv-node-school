import { IExercise } from "../models/exercise.model";
import ExercisesRepository from "../repositories/exercises.repository";
import { CustomError} from "./customError.util";

export  async function getExerciseByIdAndCheck(exerciseId: string){

    const Exercise: (IExercise | null) = await ExercisesRepository.getById(exerciseId);
        if(!Exercise){
            throw new CustomError('Exercise not found.', 404);
        }
    return Exercise;
}