import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { WorkSpace } from '../schemas/workspace.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { ROLES } from '../utils/roles.enum';
import { CreateOrganizationDto } from './dtos/createOrganization.dto';
import { UpdateOrganizationDto } from './dtos/updateOrganization.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class WokrSpaceService {

            constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
            @InjectModel(WorkSpace.name) private readonly workSpaceModel: Model<WorkSpace>,
            private readonly userService: UserService
        ) {}

        async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<WorkSpace> {
            //Check if the workspace wtih the name exist
        const workspace = await this.workSpaceModel.findOne({name:createOrganizationDto.organizationName}).exec();
            
           if(workspace)
           throw new BadRequestException({message:"WorkSpace with this name si already exist" }); 
           else {
            const newWorkspace = await this.workSpaceModel.create({name:createOrganizationDto.organizationName});

                let newUser:CreateUserDto = {email:createOrganizationDto.email,workSpace:newWorkspace._id,password:createOrganizationDto.password,username:createOrganizationDto.username,is_active:true,role:ROLES.WORKSPACE_ADMIN} 
                 await this.userService.create(newUser);
                 return newWorkspace;
            }
       }

       async updateOrganization(idOrganization:any,updateOrganizationDto:UpdateOrganizationDto): Promise<WorkSpace> {
        //Check if the workspace with the name exist
        const workspace = await this.workSpaceModel.findById(idOrganization).exec();
        
        if(!workspace)
        throw new NotFoundException({message:"WorkSpace doesn't exist" }); 

        const workspaceWithName = await this.workSpaceModel.findOne({name:updateOrganizationDto.organizationName,_id: {$ne: idOrganization}}).exec();
        
       if(workspaceWithName)
       throw new BadRequestException({message:"WorkSpace with this name si already exist" }); 
       else {
          return  await  workspace.update({name:updateOrganizationDto.organizationName});

        }
   }

        async findAll(): Promise<WorkSpace[]> {
        return await  this.workSpaceModel.find();
        }

        async findById(id:any): Promise<WorkSpace> {
        return await this.workSpaceModel.findById(id).exec();
        }

        async deleteOne(id:any)  {
           const  workspace = await this.findById(id);
           if(!workspace) return false ;
             await this.workSpaceModel.updateOne({_id:id},{is_active:false}).exec();
             await this.userModel.updateMany({workSpace:workspace._id},{is_active:false}).exec();
                return true;
            }


}
