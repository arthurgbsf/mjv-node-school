import UserRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import { CustomError }  from "../utils/customError.util";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

class UserService{

    async authorization(id:string, password:string){
        const user: (IUser | null) = await UserRepository.getById(id);
        if(user === null){
            throw new CustomError('Usuário não encontrado.', 404);  
        };
        const result: Boolean = await bcrypt.compare(password,user.password);   
        if(result){
            return jwt.sign({_id: user._id}, secretJWT, {
                expiresIn:  '1h'
            });
        }

        throw new CustomError('Falha na autenticação', 407); 
    }

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
        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        return await UserRepository.create(user);
    };

    async update(id:string, user: Partial<IUser>){
        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
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