import { Router, Response, Request } from "express";
import UsersService from "../services/users.service";
import { IUser } from "../models/user.model";
import { CustomError } from "../utils/customError.util";
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware.middleware";
import { RequiredFieldsMiddleware } from "../middlewares/RequiredFieldsMiddleware.middleware";


const router = Router();

router.get('/', authenticationMiddleware, async (req:Request, res:Response) => {
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

router.get('/profile', authenticationMiddleware, async (req:Request, res:Response) => {
    try {
        const user = await UsersService.getById(req.headers['authorization']);
        return res.status(200).send(user);
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
        return res.status(201).send(user);
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.post('/authentication', async (req:Request, res:Response) => {
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

router.put('/update', authenticationMiddleware, async (req:Request, res:Response) => {
    try {
        await UsersService.update(req.body, req.headers['authorization']);
        return res.status(200).send({message:"Usuário alterado com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/delete', authenticationMiddleware, async (req:Request, res:Response) => {
    try {
        await UsersService.remove( req.headers['authorization']);
        req.headers['authorization'] = undefined;
        return res.status(200).send({message:"Usuário removido com sucesso"}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;