import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../user/dto/login-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) { }
    
    @Post('login') 
    async login(@Body() loginUserDto: LoginDto, @Res() res){
        const result = await this.authService.validateUserByPassword(loginUserDto);
        if (result.success) {
            return res.status(HttpStatus.ACCEPTED).json(result.data);
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({msg: result.msg});
        }
    }
}
