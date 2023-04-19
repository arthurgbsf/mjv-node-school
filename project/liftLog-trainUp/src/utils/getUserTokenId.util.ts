import { CustomError } from "./customError.util";
import { getToken } from "./getToken.utils";
import jwt from "jsonwebtoken";

export function getUserTokenId( headers:(string | undefined), secret:string){
    if(!headers){
        throw new CustomError("O token não foi encontrado.")
    }
    const userToken = getToken(headers);
    const authUser = jwt.verify(userToken, secret) as {_id:string};
    return authUser._id

};