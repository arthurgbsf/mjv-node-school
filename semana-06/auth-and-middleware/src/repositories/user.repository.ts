import { User, IUser } from "../models/user.model";

class UserRepository{

    getAll(){
        return User.find();
    };

    getById(id:string){
        return User.findOne({_id:id});
    };

    create(user:IUser){
        return User.create(user);
    };

    update(id:string, user: Partial<IUser>){
        return User.updateOne({_id:id},{$set: user});
    };

    remove(id:string){
        return User.deleteOne({_id:id});
    }
}


export default new UserRepository;