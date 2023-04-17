import { Router, Response, Request } from "express";
import UsersService from "../services/users.service";
import { IUser } from "../models/user.model";
import { CustomError } from "../utils/customError.util";
import { authorizationMiddleware } from "../middlewares/authorizationMiddleware.middleware";
import { isOwnerMiddleware } from "../middlewares/isOwnerMiddleware.middleware";
import { RequiredFieldsMiddleware } from "../middlewares/RequiredFieldsMiddleware.middleware";


const router = Router();

router.get('/', authorizationMiddleware, async (req:Request, res:Response) => {
    try {
        const users = await UsersService.getAll();
        return res.status(200).send(users);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.get('/:id', authorizationMiddleware, /*isOwnerMiddleware,*/ async (req:Request, res:Response) => {
    try {
        const users = await UsersService.getById(req.params.id);
        res.status(200).send(users);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    } 
});

router.post('/new', RequiredFieldsMiddleware, async (req:Request, res:Response) => {
    try {
        const user: IUser = await UsersService.create(req.body);
        res.status(201).send(user);
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.post('/authorization', async (req:Request, res:Response) => {
    try {
        const token = await UsersService.authorization(req.body.email, req.body.password);
        return res.status(202).send({token});
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
})

router.put('/:id', authorizationMiddleware, isOwnerMiddleware, async (req:Request, res:Response) => {
    try {
        await UsersService.update(req.params.id, req.body);
        res.status(200).send({message:"Usuário alterado com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/delete/:id', authorizationMiddleware, isOwnerMiddleware, async (req:Request, res:Response) => {
    try {
        await UsersService.remove(req.params.id);
        res.status(200).send({message:"Usuário removido com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;