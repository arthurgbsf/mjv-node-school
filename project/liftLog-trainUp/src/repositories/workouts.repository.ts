import { Workout, IWorkout } from "../models/workout.model";

class WorkoutsRepository{

    getAll(){
        return Workout.find().populate({
            path: 'myCreatedExercises',
            model: 'Exercise'
          });;
    };

    getById(id:string){
        return Workout.findById({_id:id}).populate({
            path: 'myCreatedExercises',
            model: 'Exercise'
          });
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

    updateExercises(workoutId: string, exerciseId: string) {
        return Workout.updateOne({_id: workoutId}, {$push: {exercises: exerciseId}});
    }
};

export default new WorkoutsRepository;

