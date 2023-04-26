import { Response, Request, NextFunction } from "express";

function required<T>(model: Partial<T>, allowedKeys: Array<keyof T>) {
    const userKeys = Object.keys(model);
    const hasInvalidKey = userKeys.some((key) => !allowedKeys.includes(key as keyof T));
    if (hasInvalidKey) {
      throw new Error(`Is just allowed to update ${allowedKeys.join(", ")}.`);
    }
  }

export const requiredFields = <T>(allowedKeys: Array<keyof T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const model: Partial<T> = req.body;
      try {
        required<T>(model, allowedKeys);
        next();
      } catch (error:any) {
        return res.status(400).send({ message: error.message });
      }
    };
  };