import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards,Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import {  Types } from 'mongoose';
import { WorkSpaceAdminGuard } from 'src/guard/workspace-admin.guard';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { SuperAdminGuard } from '../../guard/super-admin.guard';
import { ParseObjectIdPipe } from '../../pipes/parse-objectid.pipe';
import { User } from '../../schemas/user.schema';
import { CreateWorkSpaceUserDto } from './dtos/create.workspace.dto';
import { UpdateWorkSpaceUserDto } from './dtos/update.workspaceuser.dto';
import { UserWorkSpaceService } from './user-workSpace.service';

@ApiTags('Company-user')
@ApiBearerAuth()
@Controller('workspace/user')
@UseGuards(WorkSpaceAdminGuard)
export class UserWorkSpaceController {

    constructor(private readonly userCompanyService: UserWorkSpaceService) {}

    @ApiCreatedResponse({
      type: User ,
      status:HttpStatus.CREATED,
    })

    @Post()
    async create(@Res() res,@AuthUser() user,@Body() createUserDto: CreateWorkSpaceUserDto) {
      try {

       let userCreated =  await this.userCompanyService.create(user.organization,createUserDto);
        return res.status(HttpStatus.OK).json({message:'User has been created successfully',data:userCreated})

      } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
      }
    }
    
    @ApiOkResponse({
      type: User ,
      status:HttpStatus.OK
    })
    @ApiBadRequestResponse({
      description:"the id param  is not type of ObjectId"
    })

    @ApiParam({name: 'id',type:Types.ObjectId})

    @Put(":id")
    async update(@Param('id',ParseObjectIdPipe) id,@Res() res,@AuthUser() user, @Body() updateUserDto: UpdateWorkSpaceUserDto) {
     
      try {
        let UserUpdated = await this.userCompanyService.update(user.organization,id,updateUserDto);
        return res.status(HttpStatus.OK).json({message:'User has been updated successfully',data:UserUpdated})

      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json(error);
      }
    }


    
    @ApiOkResponse({
      type: User ,
      isArray: true 
    })
   
    @Get()
    async findAll(@AuthUser() user,@Query() query ): Promise<User[]> {
      return this.userCompanyService.findByWorkSpace(user.organization,query);
    }

    @ApiOkResponse({
      type: User ,
    })

    @ApiBadRequestResponse({
      description:"the id  is not type of ObjectId",
      status:HttpStatus.BAD_REQUEST
    })

    @ApiParam({name: 'id',type:Types.ObjectId})

    
    @Get(":id")
    async findbyId(@Param('id',ParseObjectIdPipe) id,@Res() res,@AuthUser() user): Promise<User> {
       
     const userEntity = await  this.userCompanyService.findOneByIdAndWorkSpace(id,user.organization);
 
    return res.status(HttpStatus.OK).json(userEntity ? userEntity : []);
    }

    @ApiOkResponse({
      type: String ,
      status:HttpStatus.OK
    })
    @ApiBadRequestResponse({
      description:"the id  is not type of ObjectId"
    })
    @ApiNotFoundResponse({
      description:'the user doesn\'t exist ',
      status:HttpStatus.NOT_FOUND
    })
    
    @ApiParam({name: 'id',type:Types.ObjectId})
    
    @Delete(":id")
    async deleteOne(@Param('id',ParseObjectIdPipe) id,@Res() res,@AuthUser() user) {
      
      const userDeleted =  await this.userCompanyService.deleteOne(id,user.organization);

      if(!userDeleted)
      return res.status(HttpStatus.BAD_REQUEST).json({message:'User Doesn\'t exist '});

    return res.status(HttpStatus.OK).json({message : "User deleted with sucess"} );
    }
}
