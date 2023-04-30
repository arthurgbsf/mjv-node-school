import UsersRepository from "../repositories/users.repository";
import { CustomError } from "./customError.util";
import { IUser } from "../models/user.model";


export async function getUserByIdAndCheck(userId: string){
    const user: (IUser | null) = await UsersRepository.getById(userId);
        if(user === null){
            throw new CustomError('User not found.', 404);  
        };
    return user;
}