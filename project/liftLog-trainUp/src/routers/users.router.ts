import { Router, Response, Request } from "express";
import UsersService from "../services/users.service";
import { IUser } from "../models/user.model";
import { CustomError } from "../utils/customError.util";
import { auth } from "../middlewares/auth.middleware";
import { validateFields } from "../middlewares/validateFields.middleware";
import { requiredFields } from "../middlewares/requiredFields.middleware";

const router = Router();

router.get('/', auth, async (req:Request, res:Response) => {
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

router.get('/user', auth, async (req:Request, res:Response) => {
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

router.post('/user', validateFields<IUser>(["name", "email", "password"]), async (req:Request, res:Response) => {
    try {
        await UsersService.create(req.body);
        return res.status(201).send({message: "User created."});
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.post('/authentication', validateFields<IUser>(["email", "password"]), async (req:Request, res:Response) => {
    try {
        const token = await UsersService.auth(req.body.email, req.body.password);
        return res.status(200).send({token});
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
})

router.put('/user', auth, requiredFields<IUser>(["name", "email", "password"]), async (req:Request, res:Response) => {
    try {
        await UsersService.update(req.body, req.headers['authorization']);
        return res.status(200).send({message:"User updated."}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/user', auth, async (req:Request, res:Response) => {
    try {
        await UsersService.remove( req.headers['authorization']);
        req.headers['authorization'] = undefined;
        return res.status(200).send({message:"The user was deleted."}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;