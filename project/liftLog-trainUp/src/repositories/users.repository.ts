import mongoose from "mongoose";
import { User, IUser } from "../models/user.model";
import { ObjectId } from "mongoose";



class UsersRepository{

    getAll(filter:Object| null = null){
        return User.find({}, filter);
    };

    getByEmail(email:string){
        return User.findOne({email:email});
    };

    getById(id:string){
        return User.findById({_id:id});
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

    updateMyWorkouts(userId: string, workoutId: ObjectId) {
        return User.updateOne({_id: userId}, {$push: {myCreatedWorkouts: workoutId}});
    }

    updateMyExercises(userId: string, exerciseId: ObjectId) {
        return User.updateOne({_id: userId}, {$push: {myCreatedExercises: exerciseId}});
    }
};

export default  new UsersRepository;