import ExercisesRepository from '../repositories/exercises.repository';
import { IExercise } from '../models/exercise.model';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import { isValidObjectId, UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import mongoose, {ObjectId} from "mongoose";
import UsersRepository from '../repositories/users.repository';

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class ExercisesService{

    async getAll(){
        const exercises: Array<IExercise> = await ExercisesRepository.getAll();
        if(exercises.length === 0){
            throw new CustomError('Nenhum exercício cadastrado.', 404);
        };
        return exercises;
    };
// Vĺaidação possivel de padronização
    async getById(id:string){
        if(!isValidObjectId(id)){
            throw new CustomError("Tipo de Id Inválido");
        }
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
        const createdExerciseId: ObjectId | undefined = createdExercise._id

        if (createdExerciseId) {
            await UsersRepository.updateMyExercises(userId, createdExerciseId.toString());
        }

        return createdExercise;        
    };

    async update(exercise: Partial<IExercise>, headers:(string | undefined), exerciseId:string){

        if(!isValidObjectId(exerciseId)){
            throw new CustomError("Tipo de Id Inválido");
        }

        const currentExercise:IExercise | null = await ExercisesRepository.getById(exerciseId);

        if(!currentExercise?._id){
            throw new CustomError("Esse exercício não existe.");
        }

        const userId:string = getUserTokenId(headers, secretJWT);
        if(userId !== currentExercise.createdBy.toString()){
            throw new CustomError("Impossível editar um exercício de terceiro.")
        }

        const ExerciseWithUpdatedDate: Partial<IExercise> = {...exercise, updatedAt: new Date()};

        const result: UpdateWriteOpResult = await ExercisesRepository.update(exerciseId, ExerciseWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Exercício não encontrado.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError('O Exercício não foi alterado.');
        };
    };

    async remove(headers:string | undefined, exerciseId:string){

        if(!isValidObjectId(exerciseId)){
            throw new CustomError("Tipo de Id Inválido");
        }

//Trasformar em uma função
        const currentExercise:IExercise | null = await ExercisesRepository.getById(exerciseId);
        if(!currentExercise?._id){
            throw new CustomError("Esse treino não existe.");
        }

        const userId:string = getUserTokenId(headers, secretJWT);
        if(userId !== currentExercise.createdBy.toString()){
            throw new CustomError("Impossível deletar um exercício de terceiro.")
        }

        const result : DeleteResult = await ExercisesRepository.remove(exerciseId);

        if(result.deletedCount === 0){
            throw new CustomError('O exercício não foi deletado.');
        }; 
    };
};

export default new ExercisesService;