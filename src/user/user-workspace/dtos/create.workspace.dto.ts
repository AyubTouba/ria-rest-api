import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { ROLES } from "../../../utils/roles.enum";

export class CreateWorkSpaceUserDto {
 
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()         
  password: string;

  @IsOptional()
  @IsString()
  role: ROLES;

  @IsOptional()  
  is_active?: boolean;

  @IsOptional()  
   webClients?: Array<Types.ObjectId>;
  }