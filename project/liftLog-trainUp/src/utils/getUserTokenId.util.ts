import { Schema} from "mongoose";

import { getToken } from "./getToken.utils";
import jwt from "jsonwebtoken";

export function getUserTokenId( headers:(string | undefined), secret:string){

    const userToken = getToken(headers);
    const authUser = jwt.verify(userToken, secret) as {_id:string};
    return authUser._id

};