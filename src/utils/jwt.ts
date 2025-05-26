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
 * Class to handle JWT token creation and verification
 * @class TokenClass
 * @param {string} authSecret - Secret key for signing the JWT
 */
class TokenClass{
    private authSecret:string
    constructor(authSecret:string){
        this.authSecret=authSecret;
    }
    /**
     * Creates a JWT token with the provided data and expiration time
     * @param {{userId:String|Number,data:Object}} data - Data to be included in the token
     * @param {Number} time - Expiration time in minutes
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
     * @param {String} token - The JWT token to verify
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
}

export default TokenClass;