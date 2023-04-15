import { CustomError } from "./customError.util";

export function getToken(token:(string | undefined)) :string {
    if(!token){
        throw new CustomError("Acesso negado", 401);
    }
    const splitedToken = token.split('Bearer ');
    const code = splitedToken[1];
    return code;
}
