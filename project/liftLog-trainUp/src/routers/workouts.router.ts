import { Router, Response, Request } from "express";
import WorkoutsService from '../services/workouts.service'
import { IWorkout } from "../models/workout.model";
import { CustomError } from "../utils/customError.util";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware";

const router = Router();

router.get('/', authorizationMiddleware, async (req:Request, res:Response) => {
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


// Qual é a melhor forma de buscar?
router.get('/:id', authorizationMiddleware, async (req:Request, res:Response) => {
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

router.post('/new', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        const workout: IWorkout | any = await WorkoutsService.create(req.body, req.headers['authorization']);
        //Pode tb mostrar uma mensagem de criado com sucesso
        return res.status(201).send(workout);
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

// Qual seria uma outra forma de pegar o id
router.put('/update/:id', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        await WorkoutsService.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Treino alterado com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/delete/:id', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        await WorkoutsService.remove( req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Treino removido com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;