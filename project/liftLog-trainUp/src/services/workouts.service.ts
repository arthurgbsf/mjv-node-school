import WorkoutsRepository from "../repositories/workouts.repository";
import { IWorkout, Workout } from '../models/workout.model';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import mongoose, {ObjectId, UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import UsersRepository from "../repositories/users.repository";
import { objectIdCheck } from "../utils/objectIdCheck.util";
import { IUser} from "../models/user.model";
import ExercisesRepository from "../repositories/exercises.repository";
import ExercisesService from "./exercises.service";
import { IExercise } from "../models/exercise.model";
import moment from "moment";
import { getWorkoutByIdAndCheck } from "../utils/getWorkoutByIdAndCheck.util";
import { getUserByIdAndCheck } from "../utils/getUserByIdAndCheck.util";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class WorkoutsService{

    async getAll(){
        const workouts: Array<IWorkout> = await WorkoutsRepository.getAll();
        if(workouts.length === 0){
            throw new CustomError('Nenhum treino cadastrado.', 404);
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
                throw new CustomError("To create a workout is required have exercises.");
            }

            if(workout.exercises.length === 0){
                throw new CustomError("Impossible create exercises without add exercises.");
            }

            workout.createdBy = new mongoose.Types.ObjectId(userId);

            const workoutWithDate: IWorkout = {...workout, createdAt: new Date()}
            const createdWorkout: IWorkout = await WorkoutsRepository.create(workoutWithDate);
            const createdWorkoutId: (ObjectId | undefined) = createdWorkout._id;

            if (createdWorkoutId === undefined) {
                throw new CustomError("Create workout error.");
            }

            createdWorkout.exercises.forEach(
                async (exerciseId) => await ExercisesRepository.addInWorkout(exerciseId,createdWorkoutId)
            );

            await UsersRepository.updateMyWorkouts(userId, createdWorkoutId);
    
            return createdWorkout;       
    };

    async copy(headers:(string|undefined), workoutId:string){
        
        objectIdCheck(workoutId);

        const userId:string = getUserTokenId(headers, secretJWT);

        const toCopyWorkout:IWorkout = await getWorkoutByIdAndCheck(workoutId);
        
        const {workout, level, createdBy} = toCopyWorkout;

        const copiedExercises = await Promise.all(
            toCopyWorkout.exercises.map(
                async (exerciseId) => {
                    const copiedExercise: IExercise = await ExercisesService.copy(headers,exerciseId.toString());
                    return copiedExercise._id }
        ));

        const copiedWorkout: IWorkout = new Workout({
            workout: workout,
            level: level, 
            exercises: copiedExercises,
            createdBy: new mongoose.Types.ObjectId(userId) ,
            copiedFrom: new mongoose.Types.ObjectId(createdBy),
            createdAt: new Date()
        });
       
        const newWorkout = await WorkoutsRepository.create(copiedWorkout);

        await UsersRepository.updateMyWorkouts(userId, newWorkout._id);

        return newWorkout;
    };

    async update(workout: Partial<IWorkout>, headers:(string | undefined), workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getWorkoutByIdAndCheck(workoutId);
        
        const userId:string = getUserTokenId(headers, secretJWT);
        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("Impossible to edit an other user's workout.");
        };

        const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout, 
            updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS ')};

        const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Workout not found.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError("The workout wasn't updated.");
        };
    };

    async remove(headers:string | undefined, workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getWorkoutByIdAndCheck(workoutId);
        
        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("Impossible to delete an other user's workout.");
        }
        
        const result : DeleteResult = await WorkoutsRepository.remove(workoutId);

        if(result.deletedCount === 0){
            throw new CustomError("The workout wasn't deleted.");
        }; 

        await UsersRepository.removeMyWorkout(userId, new mongoose.Types.ObjectId(workoutId));
    };
};

export default new WorkoutsService;