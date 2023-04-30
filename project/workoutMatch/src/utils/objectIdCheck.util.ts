import {isValidObjectId} from "mongoose";

export function objectIdCheck(id:string){

    if(!isValidObjectId(id)){
        throw new Error("Invalid Id.");
    }
};