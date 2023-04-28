import { Router, Response, Request } from "express";
import ExercisesService from "../services/exercises.service";
import { CustomError } from "../utils/customError.util";
import { auth } from "../middlewares/auth.middleware";
import { validateFields } from "../middlewares/validateFields.middleware";
import { requiredFields } from "../middlewares/requiredFields.middleware";
import { IExercise } from "../models/exercise.model";

const router = Router();

router.get('/', auth, async (req:Request, res:Response) => {
    try {
        const exercises = await ExercisesService.getAll(req.headers['authorization']);
        return res.status(200).send(exercises);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.get('/user', auth, async (req:Request, res:Response) => {
    try {
        const exercises = await ExercisesService.getAllUser(req.headers['authorization']);
        return res.status(200).send(exercises);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});



router.get('/:id', auth, async (req:Request, res:Response) => {
    try {
        const exercises = await ExercisesService.getById(req.params.id);
        return res.status(200).send(exercises);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    } 
});

router.post('/', auth, validateFields<IExercise>(["exercise","sets", "reps", "type"]), async (req:Request, res:Response) => {
    try {
        await ExercisesService.create(req.body, req.headers['authorization']);
        return res.status(201).send({message:"Exercise created."});
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.post('/:id', auth, async (req:Request, res:Response) => {
    try {
        await ExercisesService.copy(req.headers['authorization'], req.params.id);
        return res.status(201).send({message: "Copied with success."});
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.put('/update/:id', auth, requiredFields<IExercise>(["exercise", "sets", "reps", "type"]), async (req:Request, res:Response) => {
    try {
        await ExercisesService.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Exercise updated. "}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/delete/:id', auth, async (req:Request, res:Response) => {
    try {
        await ExercisesService.remove( req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"The exercise was deleted with success."}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;