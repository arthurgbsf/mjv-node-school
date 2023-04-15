import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { getToken } from "../utils/getToken.utils";
dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

export function isOwnerMiddleware(req:Request, res:Response, next:NextFunction){
    const userToken = getToken(req.headers['authorization']);
    const user = jwt.verify(userToken, secretJWT) as {_id:string};
    if(user._id !== req.params.id){
        res.status(404).send({message:"Não autorizado. Este não é seu usuário"});
    }
    next();
}
