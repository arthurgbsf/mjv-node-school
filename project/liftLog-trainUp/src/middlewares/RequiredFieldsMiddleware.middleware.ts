import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

export const RequiredFieldsMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const user: Partial<IUser> = req.body;

        if (!user.name || !user.email || !user.password) {
            throw new Error('Entre com os campos obrigatórios: name, emailm e password.')
          }
        
      next();
    } catch (error:any) {
      return res.status(400).send({ message: error.message });
    }
  };