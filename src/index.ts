import {NextFunction, Request, Response} from "express";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IVerified{
    verified:boolean,
    data:{
        userId:string|number;
        data?:object;
        iat: number;
        exp: number;
    }
}
/**
 * Class to handle user authentication using JWT and password hashing
 * @class UserAuth
 * @extends TokenClass
 */
class UserAuth{
    private authSecret:string
    constructor(){
        this.authSecret=process.env.AUTH_SECRET!
    }
    /**
     * Creates a JWT token with the provided data and expiration time
     * @param {{userId:string|number,data:object}} data - Data to be included in the token
     * @param {number} time - Expiration time in minutes
     * @returns {Promise<String>} - Returns a promise that resolves to the created token
     */
    public async createToken(data:{userId:string|number,data:object},time:number):Promise<string>{
        return new Promise(async(resolve,reject)=>{
            try{
                const token=await jwt.sign(data,this.authSecret,{expiresIn:`${time}m`}); //time in minutes
                resolve(token);
            }catch(err:any){
                reject(err);
            }
        })
    }
    /**
     * Verifies the provided JWT token
     * @param {string} token - The JWT token to verify
     * @returns {Promise<IVerified>} - Returns a promise that resolves to an object containing verification status and data
     */
    public async verifyToken(token:string):Promise<IVerified>{
        return new Promise(async(resolve,reject)=>{
            try {
                const isVerified=await jwt.verify(token,this.authSecret);
                if(!isVerified) reject(new Error("Token expires or invalid"));
                const data=JSON.parse(JSON.stringify(isVerified));
                resolve({
                    verified:true,
                    data
                });
            } catch (err:any) {
                reject(err);
            }
        })
    }
    /**
     * Middleware to authenticate user requests using JWT token
     * @param {import("express").Request} req - Express request object
     * @param {import("express").Response} res - Express response object
     * @param {import("express").NextFunction} next - Express next function
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
            const tokenM=new UserAuth();
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
