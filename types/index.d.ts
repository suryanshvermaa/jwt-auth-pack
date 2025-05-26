import { NextFunction, Request, Response } from "express";
import TokenClass from "../dist/utils/jwt";
declare class UserAuth extends TokenClass {
    constructor();
    auth(req: Request, res: Response, next: NextFunction): Promise<void>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
export default UserAuth;