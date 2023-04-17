import { User, IUser } from "../models/user.model";


class UsersRepository{

    getAll(filter:Object| null = null){
        return User.find({}, filter);
    };

    getByEmail(email:string){
        return User.findOne({email:email});
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

    remove(id: string){
        return User.deleteOne({_id:id});
    }

};

export default  new UsersRepository;