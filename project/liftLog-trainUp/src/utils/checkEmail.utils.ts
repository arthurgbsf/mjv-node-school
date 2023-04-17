import { IUser } from "../models/user.model"
import { CustomError } from "./customError.util";

export const checkEmail = (users: Array<IUser>, user: IUser) => {

    if(users.length !== 0){
        const usersEmails: Array<string> = users.map((user) => user.email);

        if(usersEmails.includes(user.email)){
            throw new CustomError("Email já cadastrado");
        };   
    };

};