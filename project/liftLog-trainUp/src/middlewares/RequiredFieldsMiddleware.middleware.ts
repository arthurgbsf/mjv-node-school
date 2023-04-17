import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

export const RequiredFieldsMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const user: Partial<IUser> = req.body;

        if (!user.name || !user.email || !user.password) {
            let errorMessage: string = 'Entre com os campos obrigatórios: ';
            if (!user.name) {
              errorMessage += 'name, ';
            }
            if (!user.name) {
              errorMessage += 'email, ';
            }
            if (!user.password) {
              errorMessage += 'password, ';
            }
            errorMessage = errorMessage.slice(0, -2); 
            throw new Error(errorMessage)
          }
        
      next();
    } catch (error:any) {
      return res.status(400).send({ message: error.message });
    }
  };