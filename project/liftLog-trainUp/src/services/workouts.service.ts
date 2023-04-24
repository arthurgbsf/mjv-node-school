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

    //RETORNA UM TREINO POR ID 
    async getById(id:string){
        
        objectIdCheck(id);

        const workout: (IWorkout | null) = await WorkoutsRepository.getById(id);
        if(!workout){
            throw new CustomError('Treino não encontrado.', 404);  
        };
        return workout;

    };

    //CRIA UM TREINO.
    //PARA CRIAR UM TREINO ANTES É NECESSÁRIO TER EXERCÍCIOS CADASTRADOS NO BANCO DO USUÁRIO;
    //OS EXERCÍCIOS SERÃO MOSTRADOS A PARTIR DE GET ALL MY EXERCISES E O USUARIO IRÁ SELECIONA-LOS ANTES DE
    //ENVIAR O FORM DE CRIAÇÃO DO WORKOUT, DESSA FORMA O ARRAY DE EXERCISES SERÁ PREENCHIDO COM OS IDS.
    async create(workout: IWorkout, headers:(string|undefined)){

            const userId:string = getUserTokenId(headers, secretJWT);

            const user:(IUser | null) =  await UsersRepository.getById(userId);

            if(!user){
                throw new CustomError("Usuário não encontrado.");
            }

            if((user.myCreatedExercises !== undefined) && (user.myCreatedExercises.length === 0)){
                throw new CustomError("Você precisa ter exercícios antes de criar um treino.");
            }

            if(workout.exercises.length === 0){
                throw new CustomError("Impossível criar um treino sem adicionar exercícios.")
            }

            workout.createdBy = new mongoose.Types.ObjectId(userId);

            const workoutWithDate: IWorkout = {...workout, createdAt: new Date()}
            const createdWorkout: IWorkout = await WorkoutsRepository.create(workoutWithDate);
            const createdWorkoutId: (ObjectId | undefined) = createdWorkout._id;

            if (createdWorkoutId === undefined) {
                throw new CustomError("Houve um erro ao criar o treino.");
            }

            //ADICIONA O ID DO WORKOUT EM EXERCISE.INWORKOUTS
            createdWorkout.exercises.forEach(
                async (exerciseId) => await ExercisesRepository.addInWorkout(exerciseId,createdWorkoutId)
            );

            //ADICIONA O ID DO WORKOUT EM USER.MYWORKOUTS
            await UsersRepository.updateMyWorkouts(userId, createdWorkoutId);
    
            return(createdWorkout);       
    };

    async copy(headers:(string|undefined), workoutId:string){
        
        objectIdCheck(workoutId);

        const userId:string = getUserTokenId(headers, secretJWT);

        const isworkoutInMyWorkouts: IUser| null = await UsersRepository.getOne({
            _id:userId , myCreatedWorkouts:workoutId
            });

        if(isworkoutInMyWorkouts){
            throw new CustomError("The workout is had already in your list.")
        }

        //COPIAR OS EXERCICIOS DO TREINO
        // CRIAR UM NOVO ARREY DESSES EXERCIOS COM OS NOVOS IDS
        //INSERIR NO CORPO DO NOVO TREINO A SER CRIADO

        const toCopyWorkout:IWorkout | null  = await WorkoutsRepository.getById(workoutId);
        
        if(!toCopyWorkout){
            throw new CustomError("Workout not found.", 404);
        }
        
        const {workout, level, createdBy} = toCopyWorkout

        const copiedExercises = await Promise.all(toCopyWorkout.exercises.map(async (exerciseId) => {
            const copiedExercise: IExercise = await ExercisesService.copy(headers,exerciseId.toString());
            return copiedExercise._id
        }));

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

        if(workout.copiedFrom){
            throw new CustomError("Impossivel editar a referência do exercício");
        }

        const currentWorkout:IWorkout | null = await WorkoutsRepository.getById(workoutId);
        
        if(!currentWorkout){
            throw new CustomError("Esse treino não existe.");
        };

        const userId:string = getUserTokenId(headers, secretJWT);
        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("Impossível editar um treino de terceiro.")
        };

        const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout, 
            updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS ')};

        const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Treino não encontrado.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError('Treino não foi alterado.');
        };
    };

    async remove(headers:string | undefined, workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout | null = await WorkoutsRepository.getById(workoutId);
        
        if(!currentWorkout){
            throw new CustomError("Esse treino não existe.");
        }

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("Impossível deletar um treino de terceiro.")
        }
        
        const result : DeleteResult = await WorkoutsRepository.remove(workoutId);

        if(result.deletedCount === 0){
            throw new CustomError('Usuário não foi deletado.');
        }; 

        await UsersRepository.removeMyWorkout(userId, new mongoose.Types.ObjectId(workoutId));
    };
};

export default new WorkoutsService;