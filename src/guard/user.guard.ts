import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ROLES } from '../utils/roles.enum';

@Injectable()
export class UserGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
   
      if (!request.headers.authorization) {
        return false;
      }
      request.user = await this.validateToken(request.headers.authorization);
      if(request.user.role == ROLES.WORKSPACE_ADMIN || request.user.role == ROLES.USER) {
        return true;
      }
     return false;
   
    
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];

    try {
      var issuer  =  process.env.issuer;      
      var audience  =  process.env.audience;
        // SIGNING OPTIONS
        var signOptions = {
          issuer,
          audience,
      };
      const decoded: any = await jwt.verify(token, process.env.secretJWT,signOptions);
      console.log(decoded)
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}