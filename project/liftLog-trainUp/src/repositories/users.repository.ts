import { User, IUser } from "../models/user.model";


class UsersRepository{

    /* Restringir busca a principio por nome e email,
    mais vaiser interessante, trazer outros dados como amigos em comum e treinos
    concluidos no caso de implementação dessas funções */

    getAll(){
        return User.find();
    };

    getById(id:string){
        return User.findOne({_id:id});
    };

    create(user:IUser){
        return User.create(user);
    };

    update(id: string, user:Partial<IUser>){
        return User.updateOne({_id:id}, {$set:user});
    };

    delete(id: string){
        return User.deleteOne({_id:id});
    }

};

export default  new UsersRepository;