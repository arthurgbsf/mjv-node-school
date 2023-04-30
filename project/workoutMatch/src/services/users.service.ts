import { IUser } from "../models/user.model";
import UsersRepository from "../repositories/users.repository";
import { CustomError } from "../utils/customError.util";
import {UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import moment from "moment";
import { getUserByIdAndCheck } from "../utils/getUserByIdAndCheck.util";

dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

class UsersService{
   
    async auth(email:string, password:string){

        const user: (IUser | null) = await UsersRepository.getByEmail(email);
        if(user === null){
            throw new CustomError('User not found.', 404);  
        };
        const result: Boolean = await bcrypt.compare(password,user.password);   
        if(result){
            return jwt.sign({_id: user.id, email: user.email}, secretJWT, {
                expiresIn:  '1h'
            });
        }

        throw new CustomError('Authentication failed.', 407); 
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

        const user: IUser = await getUserByIdAndCheck(userId);
        
        return user;

    };

    async create(user: IUser){

        const email:IUser | null = await UsersRepository.getByEmail(user.email);
        if(email){
            throw new CustomError("Email have already registered.", 404);
        }

        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        const userWithDate: IUser = {...user, createdAt: new Date()}
        return await UsersRepository.create(userWithDate);
    };

    async update(user: Partial<IUser>, headers:string | undefined){
        
        const authUserId: string = getUserTokenId(headers, secretJWT)

        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        if(user.email) {
            console.log(user.email);
            const email:IUser | null = await UsersRepository.getByEmail(user.email);
            
            if(email){
                throw new CustomError("Email already registered.", 404);
            }
        }
        const userWithUpdatedDate: Partial<IUser> = {...user, 
            updatedAt: moment(new Date()).locale("pt-br").format('L [às] LTS ')};

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