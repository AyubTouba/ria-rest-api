import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { WorkSpace } from '../schemas/workspace.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
                @InjectModel(WorkSpace.name) private readonly workSpaceModel: Model<WorkSpace>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password  =  await bcrypt.hashSync(createUserDto.password,parseInt(process.env.hashPass))
    
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
      }
   
    async update(iduser:any,updateUserDto: UpdateUserDto): Promise<User> {
     
      const user = await this.userModel.findById(iduser).exec();
        if(!user)
        throw new NotFoundException({message:"User doesn't exist" }); 

      if(updateUserDto.password) {
        updateUserDto.password =  await bcrypt.hashSync(updateUserDto.password,parseInt(process.env.hashPass))
      }
        return this.userModel.updateOne({_id:user._id},updateUserDto);
      }

    async findAll(query:any=null): Promise<User[]> {
        return await this.userModel.find(query).exec();
      }
    
    async findById(id:any): Promise<User> {
        return await this.userModel.findById(id).exec();
      }
    
    async findOneByQuery(query:any): Promise<User> {
        return await this.userModel.findOne(query).exec();
      }

    async getUserToLogin(loginInfo:LoginDto): Promise<User> {
        return await this.userModel.findOne({email:loginInfo.email}).exec();
      }
    
      async deleteUserByQuery(query:any): Promise<any> {
        return await this.userModel.deleteOne(query).exec();
      }
}
