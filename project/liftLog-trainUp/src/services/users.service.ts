import { IUser } from "../models/user.model";
import UsersRepository from "../repositories/users.repository";
import { CustomError } from "../utils/customError.util";
import {UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { validateFields } from "../utils/validateFields.utils";

dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

class UsersService{
   
    async authorization(email:string, password:string){

        if(!email || !password){
            throw new CustomError("Email and Password is necessary.", 401)
        }

        const user: (IUser | null) = await UsersRepository.getOne({email:email});
        if(user === null){
            throw new CustomError('User not found.', 404);  
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
        const users: Array<IUser> = await UsersRepository.getAll({name:1, email:1, _id:1});
        if(users.length === 0){
            throw new CustomError('No users registered.', 404);
        };
        return users;
    };

    async getById(header:string |undefined){

        const userId: string = getUserTokenId(header, secretJWT);
      
        const user: (IUser | null) = await UsersRepository.getById(userId);
        if(user === null){
            throw new CustomError('User not found.', 404);  
        };
        return user;

    };

    async create(user: IUser){

        const email:IUser | null = await UsersRepository.getOne({email:user.email});
        if(email){
            throw new CustomError("Email already registered", 404);
        }

        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        return await UsersRepository.create(user);
    };

    async update(user: Partial<IUser>, headers:string | undefined){

        validateFields(user, ["name", "email", "password"]);
        
        const authUserId: string = getUserTokenId(headers, secretJWT)

        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        if(user.email) {
            console.log(user.email);
            const email:IUser | null = await UsersRepository.getOne({email:user.email});
            
            if(email){
                throw new CustomError("Email already register", 404);
            }
        }
        const userWithUpdatedDate: Partial<IUser> = {...user, updatedAt: new Date()};

        const result: UpdateWriteOpResult = await UsersRepository.update(authUserId, userWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError('User not found.', 404); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError('User not modified.', 404);
        };
    };

    async remove(headers:string | undefined){

        const authUserId: string = getUserTokenId(headers, secretJWT)
        
        const result : DeleteResult = await UsersRepository.remove(authUserId);
        if(result.deletedCount === 0){
            throw new CustomError("User wasn't delete", 400);
        }; 
    };
};


export default new UsersService;