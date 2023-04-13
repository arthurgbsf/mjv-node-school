import UserRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import { CustomError }  from "../utils/customError.util";


class UserService{

    async getAll(){
        const users: Array<IUser> = await UserRepository.getAll();
        if(users.length === 0){
            throw new CustomError('Nenhum usuário cadastrado.', 404);
        };
        return users;
    };

    async getById(id:string){
        const user: (IUser | null) = await UserRepository.getById(id);
        if(user === null){
            throw new CustomError('Usuário não encontrado.', 404);  
        };
        return user;

    };

    async create(user: IUser){
        return await UserRepository.create(user);
    };

    async update(id:string, user: Partial<IUser>){
        const userWithUpdatedDate: Partial<IUser> = {...user, updatedAt: new Date() };
        const result: UpdateWriteOpResult = await UserRepository.update(id, userWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Usuário não encontrado.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError('Usuário não foi modificado.', 304);
        };
    };

    async remove(id:string){
        const result : DeleteResult = await UserRepository.remove(id);
        if(result.deletedCount === 0){
            throw new CustomError('Usuário não foi deletado.', 304);
        }; 
    };

};

export default new UserService;