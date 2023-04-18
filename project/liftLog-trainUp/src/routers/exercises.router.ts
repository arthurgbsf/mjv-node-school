import { Router, Response, Request } from "express";
import ExercisesService from "../services/exercises.service";
import { CustomError } from "../utils/customError.util";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware";

const router = Router();

router.get('/', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        const exercises = await ExercisesService.getAll();
        return res.status(200).send(exercises);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});


router.get('/:id', authorizationMiddleware, async (req:Request, res:Response) => {
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

router.post('/new', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        const exercise = await ExercisesService.create(req.body,req.headers['authorization']);
        return res.status(201).send(exercise);
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.put('/update/:id', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        await ExercisesService.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Exercício alterado com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/delete/:id', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        await ExercisesService.remove( req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Exercício removido com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;