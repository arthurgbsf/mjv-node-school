import WorkoutsRepository from "../repositories/workouts.repository";
import { IWorkout } from '../models/workout.model';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import mongoose, {ObjectId, UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import UsersRepository from "../repositories/users.repository";
import { objectIdCheck } from "../utils/objectIdCheck.util";
import { IUser} from "../models/user.model";
import ExercisesRepository from "../repositories/exercises.repository";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class WorkoutsService{

    //RETORNA TODOS OS TREINOS CADASTRADOS NO APP
    //ADICIONAR FILTRO PARA NÃO INCLUIR OS TREINOS DO USUÁRIO NESSA BUSCA
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

            const createdWorkout: IWorkout = await WorkoutsRepository.create(workout);
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

        const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout, updatedAt: new Date()};

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