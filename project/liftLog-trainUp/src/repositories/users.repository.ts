import mongoose from "mongoose";
import { User, IUser } from "../models/user.model";



class UsersRepository{

    getAll(filter:Object| null = null){
        return User.find({}, filter).populate({
            path: 'myCreatedWorkouts',
            model: 'Workout'
          }).populate({
            path: 'myCreatedExercises',
            model: 'Exercise'
          });
    };

    getByEmail(email:string){
        return User.findOne({email:email});
    };

    getById(id:string){
        return User.findById({_id:id}).populate({
            path: 'myCreatedWorkouts',
            model: 'Workout'
          }).populate({
            path: 'myCreatedExercises',
            model: 'Exercise'
          });
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

    updateMyWorkouts(userId: string, workoutId: string) {
        return User.updateOne({_id: userId}, {$push: {myCreatedWorkouts: workoutId}});
    }

    updateMyExercises(userId: string, exerciseId: string) {
        return User.updateOne({_id: userId}, {$push: {MyCreatedExercises: exerciseId}});
    }
};

export default  new UsersRepository;