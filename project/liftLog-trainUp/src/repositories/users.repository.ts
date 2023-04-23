import mongoose from "mongoose";
import { User, IUser } from "../models/user.model";
import { ObjectId } from "mongoose";



class UsersRepository{

    getAll(filter:Object| null = null){
        return User.find({}, filter);
    };

    getOne(filter:Object, projections: Object | null = null){
        return User.findOne(filter, projections);
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

    removeMyWorkout(userId: string, workoutId: mongoose.Types.ObjectId) {
        return User.updateOne({_id: userId}, {$pull: {myCreatedWorkouts: workoutId}});
    }

    updateMyExercises(userId: string, exerciseId: ObjectId) {
        return User.updateOne({_id: userId}, {$push: {myCreatedExercises: exerciseId}});
    }

    removeMyExercise(userId: string, exerciseId: mongoose.Types.ObjectId) {
        return User.updateOne({_id: userId}, {$pull: {myCreatedExercises: exerciseId}});
    }


};

export default  new UsersRepository;