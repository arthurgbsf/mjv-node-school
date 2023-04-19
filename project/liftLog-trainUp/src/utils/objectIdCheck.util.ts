import { CustomError } from "./customError.util";
import {isValidObjectId} from "mongoose";

export function objectIdCheck(id:string){

    if(!isValidObjectId(id)){
        throw new CustomError("Tipo de Id Inválido");
    }
};