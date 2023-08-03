import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { ROLES } from "../../../utils/roles.enum";

export class SearchEmailDto {
 
  @IsNotEmpty()
  @IsEmail()
  email: string;

}