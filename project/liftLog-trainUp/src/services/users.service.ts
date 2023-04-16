import { IUser } from "../models/user.model";
import UsersRepository from "../repositories/users.repository";
import { CustomError } from "../utils/customError.util";
import bcrypt from 'bcrypt';

class UsersService{
    async getAll(){
        const users : Array<IUser> = await UsersRepository.getAll();
        if(users.length === 0){
            throw new CustomError("Nenhum usuário cadastrado", 404);
        }
        return users; 
    }

    async create(user:IUser){
        // Uma implentação legal seria colocar regra de caracter no password
        //verificar se o e-mail ja está cadastrado
        if(user.password){
            user.password = await bcrypt.hash(user.password, 10);
        }
        return await UsersRepository.create(user);
    }

}

export default new UsersService;