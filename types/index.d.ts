import { NextFunction, Request, Response } from "express";
import TokenClass from "../dist/utils/jwt";
interface IVerified {
    verified: boolean;
    data: {
        userId: string | number;
        data?: object;
        iat: number;
        exp: number;
    };
}
declare class UserAuth extends TokenClass {
    constructor();
    createToken(data: {userId:string|number,data:object}, time: number): Promise<string>;
    verifyToken(token: string): Promise<IVerified>;
    auth(req: Request, res: Response, next: NextFunction): Promise<void>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
export default UserAuth;