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
class TokenClass{
    private authSecret:string
    constructor(authSecret:string){
        this.authSecret=authSecret;
    }
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
}

export default TokenClass;