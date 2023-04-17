import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { getToken } from "../utils/getToken.utils";
import { CustomError } from "../utils/customError.util";
dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

export function isOwnerMiddleware(req:Request, res:Response, next:NextFunction){
    try {
        const userToken = getToken(req.headers['authorization']);
        const user = jwt.verify(userToken, secretJWT) as {_id:string};
        if(user._id !== req.params.id){
            throw new CustomError("Não autorizado. Este não é seu usuário", 404);
        };
        next();
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
            return res.status(400).send({message: error.message});
    };
};