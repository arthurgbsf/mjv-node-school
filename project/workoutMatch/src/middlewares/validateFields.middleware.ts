import { Response, Request, NextFunction } from "express";

function validate<T>(model: Partial<T>, allowedKeys: Array<keyof T>) {
  const missingKeys = allowedKeys.filter((key) => !(key in model));
  if (missingKeys.length > 0) {
    throw new Error(`The following fields are required: ${missingKeys.join(", ")}.`);
  }
}

export const validateFields = <T>(allowedKeys: Array<keyof T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const model: Partial<T> = req.body;
    try {
      validate<T>(model, allowedKeys);
      next();
    } catch (error:any) {
      return res.status(400).send({ message: error.message });
    }
  };
};
