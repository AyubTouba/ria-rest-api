import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { ROLES } from "../../utils/roles.enum";

export class CreateUserDto {
 
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()         
  password: string;

  @IsNotEmpty()
  @IsString()
  role: ROLES;

  @IsNotEmpty()
  workSpace: any;

  @IsOptional()  
  created_at?: Date;
  
  @IsOptional()  
  is_active?: boolean;

  @IsOptional()  
   webClients?: Array<Types.ObjectId>;
  }