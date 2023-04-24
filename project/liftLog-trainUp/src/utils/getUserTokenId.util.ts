import { CustomError } from "./customError.util";
import { getToken } from "./getToken.utils";
import jwt from "jsonwebtoken";

export function getUserTokenId( headers:(string | undefined), secret:string){
    if(!headers){
        throw new CustomError("Token not found.", 404)
    }
    const userToken = getToken(headers);
    const authUser = jwt.verify(userToken, secret) as {_id:string};
    return authUser._id

};