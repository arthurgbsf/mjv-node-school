import { IUser } from "../models/user.model";
import UsersRepository from "../repositories/users.repository";
import { CustomError } from "../utils/customError.util";
import { isValidObjectId, UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";


class UsersService{
   
    async authorization(email:string, password:string){
        const user: (IUser | null) = await UsersRepository.getByEmail(email);
        if(user === null){
            throw new CustomError('Usuário não encontrado.', 404);  
        };
        const result: Boolean = await bcrypt.compare(password,user.password);   
        if(result){
            return jwt.sign({_id: user.id, email: user.email}, secretJWT, {
                expiresIn:  '1h'
            });
        }

        throw new CustomError('Falha na autenticação', 407); 
    }

    async getAll(){
        const users: Array<IUser> = await UsersRepository.getAll();
        if(users.length === 0){
            throw new CustomError('Nenhum usuário cadastrado.', 404);
        };
        return users;
    };

    async getById(id:string){
        if(!isValidObjectId(id)){
            throw new CustomError("Tipo de Id Inválido");
        }
        const user: (IUser | null) = await UsersRepository.getById(id);
        if(user === null){
            throw new CustomError('Usuário não encontrado.', 404);  
        };
        return user;

    };

    async create(user: IUser){
        
        const users:Array<IUser> = await UsersRepository.getAll()

        if(users.length !== 0){
            const usersEmails:Array<string> = users.map((user) => user.email);

            if(usersEmails.includes(user.email)){
                throw new CustomError("Email já cadastrado");
            }
            
        }
        
        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        return await UsersRepository.create(user);
    };

    async update(id:string, user: Partial<IUser>){

        if(!isValidObjectId(id)){
            throw new CustomError("Tipo de Id Inválido");
        }

        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        const userWithUpdatedDate: Partial<IUser> = {...user, updatedAt: new Date()};

        const result: UpdateWriteOpResult = await UsersRepository.update(id, userWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('Usuário não encontrado.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError('Usuário não foi modificado.');
        };
    };

    async remove(id:string){

        if(!isValidObjectId(id)){
            throw new CustomError("Tipo de Id Inválido");
        }

        const result : DeleteResult = await UsersRepository.remove(id);

        if(result.deletedCount === 0){
            throw new CustomError('Usuário não foi deletado.');
        }; 
    };
};

export default new UsersService;