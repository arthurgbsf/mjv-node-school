import { IWorkout } from "../models/workout.model";
import WorkoutsRepository from "../repositories/workouts.repository";
import { CustomError} from "./customError.util";

export  async function getWorkoutByIdAndCheck(workoutId: string){

    const workout: (IWorkout | null) = await WorkoutsRepository.getById(workoutId);
    if(!workout){
        throw new CustomError('Workout not found.', 404);  
    };
    return workout;
    
       
}




