import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../schemas/user.schema';
import { LoginDto } from '../user/dto/login-user.dto';
import { Algorithm } from 'jsonwebtoken';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
    constructor(private usersService: UserService, private jwtService: JwtService){ }

    async validateUserByPassword(loginAttempt: LoginDto): Promise<any> {
        const userToAttempt: User = await this.usersService.getUserToLogin(loginAttempt);
            
        return new Promise(async (resolve) => {
            if (!userToAttempt) {
                resolve({success: false, msg: 'the information are incorrect'});
            }else {
                const checkPassword =  await this.checkUserPassword(userToAttempt,loginAttempt.password);
                
                if(!checkPassword)
                    resolve({success: false, msg: 'the information are incorrect'});
                      else
                resolve({success: true, data: this.createJwtPayload(userToAttempt)});
            }
        });
    }

    createJwtPayload(user){

      

        var issuer  =  process.env.issuer;         
        var subject  = user.id;    
        var audience  =  process.env.audience; 
        const data: JwtPayload = {
            id: user.id,
            organization: user.workSpace ?  user.workSpace._id : null ,
            role:user.role,
            username:user.username,
            webclients: user.webClients && user.webClients.length > 0 ? user.webClients : null  
        };
       
        // SIGNING OPTIONS
        let  algorithm:Algorithm =  "RS256";
        var signOptions = {
            issuer,
            subject,
            audience,
            expiresIn:  "200m",
            //algorithm,
            //secret:process.env.privateTokenKey
        };
        const jwt = this.jwtService.sign(data,signOptions);
        return {
            token: jwt            
        }
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findById(payload.id);
    }

    async checkUserPassword(user, password): Promise<boolean> {
        //... fetch user from a db etc.
        const match = await bcrypt.compare(password, user.password);
       
        if(!match) {
           return false;
        }
     
       return true;
    }
}
