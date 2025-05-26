import {NextFunction, Request, Response} from "express";
import TokenClass from "./utils/jwt";
import "dotenv/config";
import bcrypt from "bcrypt";

class UserAuth extends TokenClass{
    constructor(){
        super(process.env.AUTH_SECRET!);
    }
    async auth(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {authToken}=req.body||req.query||req.params;
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
    public async comparePassword(hashedPassword:string,password:string):Promise<boolean>{
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
