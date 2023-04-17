import { Workout, IWorkout } from "../models/workout.model";


class WorkoutsRepository{

    getAll(){
        return Workout.find();
    };

    getById(id:string){
        return Workout.findById({_id:id});
    };

    create(workout:IWorkout){
        return Workout.create(workout);
    };

    update(id: string, workout:Partial<IWorkout>){
        return Workout.updateOne({_id:id}, {$set:workout});
    };

    remove(id: string){
        return Workout.deleteOne({_id:id});
    }
};

export default new WorkoutsRepository;

