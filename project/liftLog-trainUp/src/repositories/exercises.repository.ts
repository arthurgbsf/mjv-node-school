import { Exercise, IExercise } from "../models/exercise.model";

class ExercisesRepository{

    getAll(){
        return Exercise.find();
    };

    getById(id:string){
        return Exercise.findById({_id:id});
    };

    create(exercise:IExercise){
        return Exercise.create(exercise);
    };

    update(id: string, exercise:Partial<IExercise>){
        return Exercise.updateOne({_id:id}, {$set:exercise});
    };

    remove(id: string){
        return Exercise.deleteOne({_id:id});
    }
};

export default new ExercisesRepository;

