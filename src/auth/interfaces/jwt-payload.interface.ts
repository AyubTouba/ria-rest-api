export interface JwtPayload {
    id: any;
    username: string;
    organization?:string | null ;
    webclients?:Array<any>| null ;
    role:string;
}