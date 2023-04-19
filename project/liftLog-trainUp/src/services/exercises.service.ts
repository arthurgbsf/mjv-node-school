import { IExercise } from "../models/exercise.model";
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import mongoose, {ObjectId, UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import UsersRepository from "../repositories/users.repository";
import { objectIdCheck } from "../utils/objectIdCheck.util";
import ExercisesRepository from "../repositories/exercises.repository";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class ExercisesService{


    //FILTRAR PARA NÃO BUSCAR OS EXERCICIOS COPIADOS
    async getAll(){
        const exercise: Array<IExercise> = await ExercisesRepository.getAll();
        if(exercise.length === 0){
            throw new CustomError('Nenhum exercício cadastrado.', 404);
        };
        return exercise;
    };

    async getById(id:string){
        
        objectIdCheck(id);

        const exercise: (IExercise | null) = await ExercisesRepository.getById(id);
        if(exercise === null){
            throw new CustomError('Exercício não encontrado.', 404);  
        };
        return exercise;

    };

    async create(exercise: IExercise, headers:(string|undefined)){

            const userId:string = getUserTokenId(headers, secretJWT);

            exercise.createdBy = new mongoose.Types.ObjectId(userId);

            const createdExercise: IExercise = await ExercisesRepository.create(exercise);
            const createdExerciseId: (ObjectId | undefined) = createdExercise._id

            if (createdExerciseId === undefined) {
                throw new CustomError("Houve um erro ao criar o exercício.")
            }

            await UsersRepository.updateMyExercises(userId,createdExerciseId);
            
            return(createdExercise);       
    };

    async update(exercise: Partial<IExercise>, headers:(string | undefined), exerciseId:string){

        objectIdCheck(exerciseId);

        const currentExercise:(IExercise | null) = await ExercisesRepository.getById(exerciseId);
        if(!currentExercise){
            throw new CustomError("Esse treino não existe.");
        }

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentExercise.createdBy.toString()){
            throw new CustomError("Impossível editar um treino de terceiro.")
        }

        const exerciseWithUpdatedDate: Partial<IExercise> = {...exercise, updatedAt: new Date()};

        const result: UpdateWriteOpResult = await ExercisesRepository.update(exerciseId, exerciseWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Exercício não encontrado.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError('O Exercício não foi alterado.');
        };
    };

    async remove(headers:string | undefined, exerciseId:string){

        objectIdCheck(exerciseId);

        const currentExercise:(IExercise | null) = await ExercisesRepository.getById(exerciseId);
        
        if(!currentExercise){
            throw new CustomError("Esse exercício não existe.");
        }

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentExercise.createdBy.toString()){
            throw new CustomError("Impossível deletar um exercício de terceiro.")
        }
        
        const result : DeleteResult = await ExercisesRepository.remove(exerciseId);

        if(result.deletedCount === 0){
            throw new CustomError('O Exercício não foi deletado.');
        }; 
    };
};

export default new ExercisesService;