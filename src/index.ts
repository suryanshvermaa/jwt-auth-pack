import {NextFunction, Request, Response} from "express";
import TokenClass from "./utils/jwt";
import "dotenv/config";
import bcrypt from "bcrypt";

/**
 * Class to handle user authentication using JWT and password hashing
 * @class UserAuth
 * @extends TokenClass
 */
class UserAuth extends TokenClass{
    constructor(){
        super(process.env.AUTH_SECRET!);
    }
    /**
     * Middleware to authenticate user requests using JWT token
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next function
     * @returns {Promise<void>}
     */
    async auth(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {authToken}=req.body||req.query||req.params||req.headers["authtoken"]||req.headers["authorization"]?.split("Bcrypt ")[1]||req.cookies["authToken"];
            if(!authToken){
                res.status(401).json({
                    success:false,
                    message:"Unauthorised",
                    data:{}
                })
                return;
            }
            const tokenM=new TokenClass(process.env.AUTH_SECRET!);
            const data=await tokenM.verifyToken(authToken);         
            req.userId=data.data.userId;
            next();
        } catch (err:any) {
            next(err);
        }
    }
    /**
     * Hashes the provided password using bcrypt
     * @param {string} password - The password to hash
     * @returns {Promise<string>} - Returns a promise that resolves to the hashed password
     */
    public async hashPassword(password:string):Promise<string>{
        return new Promise(async(resolve,reject)=>{
            try {
                const hashedPassword=await bcrypt.hash(password,10);
                resolve(hashedPassword);
            } catch (err:any) {
                reject(err);
            }
        })
    }
    /**
     * Compares a plain password with a hashed password
     * @param {string} password - The plain password to compare
     * @param {string} hashedPassword - The hashed password to compare against
     * @returns {Promise<boolean>} - Returns a promise that resolves to true if the passwords match, false otherwise
     */
    public async comparePassword(password:string,hashedPassword:string):Promise<boolean>{
        return new Promise(async(resolve,reject)=>{
            try {
                const isEqual=await bcrypt.compare(password,hashedPassword);
                if(isEqual) resolve(true);
                else resolve(false);
            } catch (error) {
                reject(error);
            }
        })
    }
}

// Export for CommonJS
module.exports = UserAuth;
// Export for ES modules
export default UserAuth;
