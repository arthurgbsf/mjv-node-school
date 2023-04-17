import WorkoutsRepository from "../repositories/workouts.repository";
import { IWorkout } from '../models/workout.model';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import { isValidObjectId, UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import { Schema } from "mongoose";

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
        if(!isValidObjectId(id)){
            throw new CustomError("Tipo de Id Inválido");
        }
        const workout: (IWorkout | null) = await WorkoutsRepository.getById(id);
        if(workout === null){
            throw new CustomError('Treino não encontrado.', 404);  
        };
        return workout;

    };

    async create(workout: IWorkout, headers:(string|undefined)){

        if(workout){
            const userId:string = getUserTokenId(headers, secretJWT); 
            workout.createdBy = new Schema.Types.ObjectId(userId);
        }
        return await WorkoutsRepository.create(workout);
    };

    async update(workout: Partial<IWorkout>, headers:(string | undefined), workout_id:string){

        if(!isValidObjectId(workout_id)){
            throw new CustomError("Tipo de Id Inválido");
        }

        const id:IWorkout | null = await WorkoutsRepository.getById(workout_id);
        if(!id){
            throw new CustomError("Esse treino não existe.");
        }

        const userId:string = getUserTokenId(headers, secretJWT);
        if(userId !== workout_id){
            throw new CustomError("Impossível editar um treino de terceiro.")
        }

        const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout, updatedAt: new Date()};

        const result: UpdateWriteOpResult = await WorkoutsRepository.update(workout_id, WorkoutWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Treino não encontrado.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError('Treino não foi alterado.');
        };
    };

    async remove(headers:string | undefined, workout_id:string){

        if(!isValidObjectId(workout_id)){
            throw new CustomError("Tipo de Id Inválido");
        }

        const id:IWorkout | null = await WorkoutsRepository.getById(workout_id);
        if(!id){
            throw new CustomError("Esse treino não existe.");
        }

        const userId:string = getUserTokenId(headers, secretJWT);
        if(userId !== workout_id){
            throw new CustomError("Impossível deletar um treino de terceiro.")
        }

        const result : DeleteResult = await WorkoutsRepository.remove(workout_id);

        if(result.deletedCount === 0){
            throw new CustomError('Usuário não foi deletado.');
        }; 
    };
};

export default new WorkoutsService;