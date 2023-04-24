import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import { CustomError } from "../utils/customError.util";

export const RequiredFieldsMiddleware = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const user: Partial<IUser> = req.body;

        if (!user.name || !user.email || !user.password) {
            throw new CustomError('Name, Email and Password are required.', 401);
          }
        
      next();
    } catch (error:any) {
      return res.status(400).send({ message: error.message });
    }
  };