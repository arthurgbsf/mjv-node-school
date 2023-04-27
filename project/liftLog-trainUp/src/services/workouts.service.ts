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

        //CHECA SE O USUARIO POSSUI EXERCICIOS
        if((user.myCreatedExercises !== undefined) && (user.myCreatedExercises.length === 0)){
            throw new CustomError("To create a workout is required have exercises.");
        }

        //CHECA SE FOI PASSADO O ARRAY DE EXERCICIOS E SE OS IDS ESTÃO VINCULADOS AO USUARIO
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
        //CHECA SE O ID É VÁLIDO
        objectIdCheck(workoutId);
        // RETORNA O ID DO USUÁRIO QUE ESTÁ LOGADO
        const userId:string = getUserTokenId(headers, secretJWT);
        //CHECA SE O WORKOUT EXISTE NO BANCO DE DADOS, CASO SIM O RETORNA
        const toCopyWorkout: IWorkout = await getWorkoutByIdAndCheck(workoutId);
        //FAZ UMA COPIA DOS EXERCICIOS DO WORKOUT PARA O BANCO DE DADOS DO USUÁRIO
        // E RETORNA OS IDS DOS EXERCICIOS COPIADOS
        const copiedExercisesIds = await copyWorkoutExercises(toCopyWorkout, headers);
        
        const {workout, level, createdBy} = toCopyWorkout;

        //CRIA O MODELO DE COPIA DO WORKOUT JÁ REFERENCIADO OS EXERCICIOS COPIADOS
        const copiedWorkout: IWorkout = new Workout({
            workout: workout,
            level: level, 
            exercises: copiedExercisesIds,
            createdBy: new mongoose.Types.ObjectId(userId) ,
            copiedFrom: new mongoose.Types.ObjectId(createdBy),
            createdAt: new Date()
        });
       // CRIA A COPIA PARA O BANCO DE DADOS DO USUARIO
        const newWorkout = await WorkoutsRepository.create(copiedWorkout);
        //COLOCA O ID DO WORKOUT CRIADO EM TODOS EXERCICIOS DO WORKOUT
        await setRefWorkoutInExercise(newWorkout);
        //COLOCA A REFERENCIA DO WORKOUT NO DOCUMENT DO USUARIO
        await UsersRepository.updateMyWorkouts(userId, newWorkout._id);

        return newWorkout;
    };

    async update(workout: Partial<IWorkout>, headers:(string | undefined), workoutId:string){

        //CHECA SE O ID É VÁLIDO
        objectIdCheck(workoutId);

        //BUSCA O WORKOUT PASSADO COMO PARAMETRO
        const currentWorkout:IWorkout = await getWorkoutByIdAndCheck(workoutId);

        //CHECA SE O ID DO WORKOUT PERTENCE AO USUARIO
        const userId:string = getUserTokenId(headers, secretJWT);
        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("Impossible to edit an other user's workout.");
        };

        //CHECA SE OS IDS DOS EXERCICIOS PASSADOS NO BODY SÃO VALIDOS
        await validateExercises(workout,userId);

        const workoutExercises = workout.exercises

        if(workoutExercises === undefined){
            throw new CustomError("Exercises not found.", 404);
        }

        const addedExerciseIds = workoutExercises.filter(
            id => !currentWorkout.exercises.includes(id)) ?? [];

        const removedExerciseIds = currentWorkout.exercises.filter(
            id => !workoutExercises.includes(id) ?? []);


        const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout,
            exercises: workout.exercises, 
            updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS ')};

        const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Workout not found.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError("The workout wasn't updated.");
        };

        for( const exerciseId of  addedExerciseIds){
            await ExercisesRepository.addInWorkout(exerciseId, new mongoose.Types.ObjectId(workoutId));
        }


        for( const exerciseId of  removedExerciseIds){
            await ExercisesRepository.removeInWorkout(exerciseId, new mongoose.Types.ObjectId(workoutId));
        }
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
        await removeRefWorkoutInExercise(currentWorkout);
        await UsersRepository.removeMyWorkout(userId, new mongoose.Types.ObjectId(workoutId));
    };
};

export default new WorkoutsService;