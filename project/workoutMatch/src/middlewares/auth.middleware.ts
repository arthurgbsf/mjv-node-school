import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { CustomError } from "../utils/customError.util";
import { getToken } from '../utils/getToken.utils'
dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

export function auth(req:Request, res:Response, next:NextFunction){

    try {
        const token = getToken(req.headers['authorization']);
        const decoded = jwt.verify(token ,secretJWT);
    if(!decoded){
        throw new CustomError("Unauthorized.", 401);
    }
    next(); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
            return res.status(400).send({message: error.message});
    }
};