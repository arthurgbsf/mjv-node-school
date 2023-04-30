import WorkoutsRepository from "../repositories/workouts.repository";
import { IWorkout, Workout } from '../models/workout.model';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import mongoose, {UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import UsersRepository from "../repositories/users.repository";
import { objectIdCheck } from "../utils/objectIdCheck.util";
import { IUser} from "../models/user.model";
import moment from "moment";
import { getWorkoutByIdAndCheck } from "../utils/getWorkoutByIdAndCheck.util";
import { getUserByIdAndCheck } from "../utils/getUserByIdAndCheck.util";
import { validateExercises } from "../utils/validateExercises.util";
import { setRefWorkoutInExercise } from "../utils/setRefWorkoutInExercise.util";
import { copyWorkoutExercises } from "../utils/copyWorkoutExercises.util";
import { removeRefWorkoutInExercise } from "../utils/removeRefWorkoutInExercise.util";
import ExercisesRepository from "../repositories/exercises.repository";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class WorkoutsService{

    async getAll(headers:(string|undefined)){
        const userId:string = getUserTokenId(headers, secretJWT);
        const workouts: Array<IWorkout> = await WorkoutsRepository.getAll(userId);
        if(workouts.length === 0){
            throw new CustomError('No Workouts avaible.', 404);
        };
        return workouts;
    };

    async getAllUser(headers:(string|undefined)){
        const userId:string = getUserTokenId(headers, secretJWT);
        const workouts: Array<IWorkout> = await WorkoutsRepository.getAllUser(userId);
        if(workouts.length === 0){
            throw new CustomError('No workouts created or copied.', 404);
        };
        return workouts;
    };

    async getById(id:string){
        
        objectIdCheck(id);

        const workout: IWorkout = await getWorkoutByIdAndCheck(id);

        return workout;
    };
    
    async create(workout: IWorkout, headers:(string|undefined)){

        const userId:string = getUserTokenId(headers, secretJWT);

        const user:IUser =  await getUserByIdAndCheck(userId);

        if((user.myCreatedExercises !== undefined) && (user.myCreatedExercises.length === 0)){
            throw new Error("To create a workout is required have exercises.");
        }
        
        await validateExercises(workout, userId);

        workout.createdBy = new mongoose.Types.ObjectId(userId);

        const workoutWithDate: IWorkout = {...workout, createdAt: new Date()}

        const createdWorkout: IWorkout = await WorkoutsRepository.create(workoutWithDate);
        //COLOCA O ID DO WORKOUT CRIADO EM TODOS EXERCICIOS DO WORKOUT
        const createdWorkoutId = await setRefWorkoutInExercise(createdWorkout);
        //COLOCA A REFERENCIA DO WORKOUT NO DOCUMENT DO USUARIO
        await UsersRepository.updateMyWorkouts(userId, createdWorkoutId);

        return createdWorkout;       
    };

    async copy(headers:(string|undefined), workoutId:string){

        objectIdCheck(workoutId);

        const userId:string = getUserTokenId(headers, secretJWT);

        const toCopyWorkout: IWorkout = await getWorkoutByIdAndCheck(workoutId);

        const copiedExercisesIds = await copyWorkoutExercises(toCopyWorkout, headers);
        
        const {workout, level} = toCopyWorkout;

        const copiedWorkout: IWorkout = new Workout({
            workout: workout,
            level: level, 
            exercises: copiedExercisesIds,
            createdBy: new mongoose.Types.ObjectId(userId) ,
            copiedWorkoutId: new mongoose.Types.ObjectId(workoutId),
            createdAt: new Date()
        });
       
        const newWorkout = await WorkoutsRepository.create(copiedWorkout);

        await setRefWorkoutInExercise(newWorkout);

        await UsersRepository.updateMyWorkouts(userId, newWorkout._id);
              
    };

    async update(workout: Partial<IWorkout>, headers:(string | undefined), workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getWorkoutByIdAndCheck(workoutId);

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("this id is not linked to this user.", 401);
        };
        
        if(workout.exercises){

            await validateExercises(workout, userId);

            const workoutExercises = workout.exercises

            if(workoutExercises === undefined){
                throw new CustomError("Exercises not found.", 404);
            }

            const addedExerciseIds = workoutExercises.filter(
                id => !currentWorkout.exercises.includes(id)) ?? [];

            const removedExerciseIds = currentWorkout.exercises.filter(
                id => !workoutExercises.includes(id) ?? []);

            const updatedExerciseIds = workoutExercises.filter(
                id => currentWorkout.exercises.includes(id));

            const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout,
                exercises: workout.exercises, 
                updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS ')};
           
            const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);

            for( const exerciseId of  addedExerciseIds){
                await ExercisesRepository.addInWorkout(exerciseId, new mongoose.Types.ObjectId(workoutId));
            }

            for( const exerciseId of  removedExerciseIds){
                await ExercisesRepository.removeInWorkout(exerciseId, new mongoose.Types.ObjectId(workoutId));
            }

            for (const exerciseId of updatedExerciseIds) {
                await ExercisesRepository.addInWorkout(exerciseId, new mongoose.Types.ObjectId(workoutId));
            }
                    
            if(result.matchedCount === 0){
                throw new CustomError('Workout not found.', 404); 
            };
            if(result.modifiedCount === 0){
                throw new Error("Wasn't updated.");
            };

        }else{
            
            const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout,
                updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS ')};
            const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);
            if(result.matchedCount === 0){
                throw new CustomError('Workout not found.', 404); 
            };
            if(result.modifiedCount === 0){
                throw new CustomError("Wasn't updated.");
            };
        }

    };

    async remove(headers:string | undefined, workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getWorkoutByIdAndCheck(workoutId);
        
        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("This id is not linked to this user.", 401);
        }

        const result : DeleteResult = await WorkoutsRepository.remove(workoutId);

        if(result.deletedCount === 0){
            throw new Error("Wasn't deleted.");
        }; 
        await removeRefWorkoutInExercise(currentWorkout);
        await UsersRepository.removeMyWorkout(userId, new mongoose.Types.ObjectId(workoutId));
    };
};

export default new WorkoutsService;