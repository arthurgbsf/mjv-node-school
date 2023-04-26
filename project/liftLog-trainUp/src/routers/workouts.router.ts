import { Router, Response, Request } from "express";
import WorkoutsService from '../services/workouts.service'
import { IWorkout } from "../models/workout.model";
import { CustomError } from "../utils/customError.util";
import { auth } from "../middlewares/auth.middleware";
import { requiredFields } from "../middlewares/requiredFields.middleware";
import { validateFields } from "../middlewares/validateFields.middleware";

const router = Router();

router.get('/', auth, async (req:Request, res:Response) => {
    try {
        const workouts = await WorkoutsService.getAll();
        return res.status(200).send(workouts);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.get('/:id', auth, async (req:Request, res:Response) => {
    try {
        const workouts = await WorkoutsService.getById(req.params.id);
        return res.status(200).send(workouts);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    } 
});

router.post('/new', auth, validateFields<IWorkout>(["workout", "exercises"]), async (req:Request, res:Response) => {
    try {
        const workout: IWorkout | any = await WorkoutsService.create(req.body, req.headers['authorization']);
        return res.status(201).send(workout);
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.post('/:id', auth, async (req:Request, res:Response) => {
    try {
        const copiedWorkout = await WorkoutsService.copy(req.headers['authorization'], req.params.id);
        return res.status(201).send(copiedWorkout);
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.put('/update/:id', auth, requiredFields<IWorkout>(["workout", "level", "exercises"]), async (req:Request, res:Response) => {
    try {
        await WorkoutsService.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Workout updated."}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/delete/:id', auth, async (req:Request, res:Response) => {
    try {
        await WorkoutsService.remove( req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Workout deleted."}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;