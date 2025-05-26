import { NextFunction, Request, Response } from "express";
import TokenClass from "../dist/utils/jwt";
declare class UserAuth extends TokenClass {
    constructor();
    auth(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default UserAuth;
