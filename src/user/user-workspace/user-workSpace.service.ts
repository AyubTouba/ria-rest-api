import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { WorkSpace } from '../../schemas/workspace.schema';
import { ROLES } from '../../utils/roles.enum';
import { UserService } from '../user.service';
import { CreateWorkSpaceUserDto } from './dtos/create.workspace.dto';
import { UpdateWorkSpaceUserDto } from './dtos/update.workspaceuser.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UserWorkSpaceService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
                @InjectModel(WorkSpace.name) private readonly workSpaceModel: Model<WorkSpace>,
                private readonly userService: UserService,
    ) {}

    async create(workSpace:any,createUserDto: CreateWorkSpaceUserDto): Promise<User> {
        createUserDto.role = createUserDto.role == ROLES.WORKSPACE_ADMIN ? ROLES.WORKSPACE_ADMIN : ROLES.USER;
       // createUserDto.webClients = createUserDto.webClients.map(wb => Types.ObjectId(wb))
        var createUser:any = createUserDto;
        createUser.workSpace = Types.ObjectId(workSpace);
                            

        return await this.userService.create(createUser);
      }
   
    async update(workSpace:Types.ObjectId,iduser:any,updateUserDto: UpdateWorkSpaceUserDto): Promise<User> {
      const user = await this.findOneByIdAndWorkSpace(iduser,workSpace);
        if(!user)
        throw new NotFoundException({message:"User doesn't exist" }); 

        if(updateUserDto.role)
        updateUserDto.role = updateUserDto.role == ROLES.WORKSPACE_ADMIN ? ROLES.WORKSPACE_ADMIN : ROLES.USER;
        delete updateUserDto.workSpace
        return await user.updateOne(updateUserDto);
      }
    
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
      }
    
    async findOneByIdAndWorkSpace(id:Types.ObjectId,workSpace:Types.ObjectId): Promise<User> {
      const workspaceEntity =  await this.workSpaceModel.findById(workSpace);
        return await this.userService.findOneByQuery({_id:id,workSpace:workspaceEntity._id});
      }
    
    async findByWorkSpace(workSpace,query) : Promise<User[]> {
      const workspaceEntity =  await this.workSpaceModel.findById(workSpace);
      let filter = {};
      filter["workSpace"] = workspaceEntity._id;
      if ('email'.toLowerCase() in query) {
        filter["email"] = query.email;
      }
      return await this.userService.findAll(filter);
     } 
     
    async deleteOne(id:Types.ObjectId,workSpace:Types.ObjectId)  : Promise<boolean> {
          const user = await this.findOneByIdAndWorkSpace(id,workSpace);

          if(!user) return false ;
         
       const workspaceEntity =  await this.workSpaceModel.findById(workSpace);
       await this.userService.deleteUserByQuery({_id:id,workSpace:workspaceEntity._id});
       return true ;
    }
}
