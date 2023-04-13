import { Router, Response, Request } from "express";
import UsersService from "../services/users.service";
import { IUser } from "../models/user.model";
import { CustomError } from "../utils/customError.util";


const router = Router();

router.get('/', async (req:Request, res:Response) => {
    try {
        const users = await UsersService.getAll();
        res.status(200).send(users);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message})
        };
        res.status(400).send({message: error.message})
    }
});

router.get('/:id', async (req:Request, res:Response) => {
    try {
        const users = await UsersService.getById(req.params.id);
        res.status(200).send(users);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message})
        };
        res.status(400).send({message: error.message})
    }
    
});

router.post('/new', async (req:Request, res:Response) => {
    try {
        const user: IUser = await UsersService.create(req.body);
        res.status(201).send(user);
    } catch (error: any) {
        if(error instanceof CustomError)( res.status(error.code).send({message: error.message}));
        res.status(400).send({message: error.message})
        
    }
});

router.put('/:id', async (req:Request, res:Response) => {
    try {
        await UsersService.update(req.params.id, req.body);
        res.status(200).send({message:"Usuário alterado com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError)( res.status(error.code).send({message: error.message}));
        res.status(400).send({message: error.message});
    }

});

router.delete('/delete/:id', async (req:Request, res:Response) => {
    try {
        await UsersService.remove(req.params.id);
        res.status(200).send({message:"Usuário removido com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError)( res.status(error.code).send({message: error.message}));
        res.status(400).send({message: error.message});
    }
});


export default router;