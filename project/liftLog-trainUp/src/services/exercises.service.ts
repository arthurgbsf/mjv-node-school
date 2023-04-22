import { IExercise } from "../models/exercise.model";
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import mongoose, {ObjectId, UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import UsersRepository from "../repositories/users.repository";
import { objectIdCheck } from "../utils/objectIdCheck.util";
import ExercisesRepository from "../repositories/exercises.repository";
import WorkoutsRepository from "../repositories/workouts.repository";
import { IUser } from "../models/user.model";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class ExercisesService{


    //BUSCA TODOS OS EXERCÍCIOS DO APP. FALTA IMPLEMENTAR UMA  FILTRO ONDE
    //NÃO VAI BUSCAR OS EXERCÍCIOS COPIADOS
    async getAll(){
        const exercise: Array<IExercise> = await ExercisesRepository.getAll();
        if(exercise.length === 0){
            throw new CustomError('Nenhum exercício cadastrado.', 404);
        };
        return exercise;
    };

    //BUSCA UM EXERCÍCIO POR ID
    async getById(id:string){
        
        objectIdCheck(id);

        const exercise: (IExercise | null) = await ExercisesRepository.getById(id);
        if(exercise === null){
            throw new CustomError('Exercício não encontrado.', 404);  
        };
        return exercise;

    };

    //CRIA O EXERCÍCIO PARA O BANCO DE EXERCÍCIOS DO USUÁRIO
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

    async copy(headers:(string|undefined), exerciseId:string){
        
        objectIdCheck(exerciseId);

        const {sets, reps, type} = await this.getById(exerciseId);

        const copiedExercise: IExercise = new mongoose.Model({sets: sets, reps: reps, type: type, copiedFrom: new mongoose.Types.ObjectId(exerciseId)});
       
        const newExercise = await ExercisesRepository.create(copiedExercise);

        const userId:string = getUserTokenId(headers, secretJWT);

        await UsersRepository.updateMyExercises(userId, newExercise._id);

        return newExercise;
    }

    //ALTERA UM EXERCÍCIO DO BANCO DE EXERCÍCIOS DO USUÁRIO
    async update(exercise: Partial<IExercise>, headers:(string | undefined), exerciseId:string){

        objectIdCheck(exerciseId);

        if(exercise.copiedFrom){
            throw new CustomError("Impossivel editar a referência do exercício");
        }

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


    // DELETA EXÉRCICIO DO BANCO DE EXERCÍCIOS
    //QUANDO REMOVIDO DO BANCO DE EXERCÍCIOS TB É REMOVIDO DOS TREINOS
    //ACHO QUE É POSSIVEL ADICIONAR UM MIDDLEWARE DO MONGOOSE PARA DELETAR AS REFERENCIAS 
    //QUANDO O EXERCICIO FOR DELETADO 
    async remove(headers:string | undefined, exerciseId:string){

        objectIdCheck(exerciseId);

        const currentExercise:(IExercise | null) = await ExercisesRepository.getById(exerciseId);
        
        if(!currentExercise){
            throw new CustomError("Esse exercício não existe.");
        }

        if(currentExercise.inWorkouts !== undefined && currentExercise.inWorkouts.length !== 0)
            currentExercise.inWorkouts.forEach( async (workoutId ) => {
                await WorkoutsRepository.removeExercise(workoutId, exerciseId);
        });

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentExercise.createdBy.toString()){
            throw new CustomError("Impossível deletar um exercício de terceiro.")
        }

        const result : DeleteResult = await ExercisesRepository.remove(exerciseId);

        if(result.deletedCount === 0){
            throw new CustomError('O Exercício não foi deletado.');
        }; 

        await UsersRepository.removeMyExercise(userId, new mongoose.Types.ObjectId(exerciseId));
    };

    
};

export default new ExercisesService;