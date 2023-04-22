
import { IUser } from "../models/user.model";

export function validateFields(user:Partial<IUser>, allowedKeys: Array<string>) {
    const userKeys = Object.keys(user);
    const hasInvalidKey = userKeys.some((key) => !allowedKeys.includes(key));
    if (hasInvalidKey) {
      let message: string = allowedKeys.reduce((keys, key) => keys + (" |" + key)); 
        throw new Error(`Somente é permitido os inputs: |${message}`);
      }
};