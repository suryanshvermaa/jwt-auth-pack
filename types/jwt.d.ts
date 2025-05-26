interface IVerified {
    verified: boolean;
    data: {
        userId: string | number;
        data?: object;
        iat: number;
        exp: number;
    };
}
declare class TokenClass {
    private authSecret;
    constructor(authSecret: string);
    createToken(data: object, time: number): Promise<string>;
    verifyToken(token: string): Promise<IVerified>;
}
export default TokenClass;
