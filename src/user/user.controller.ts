import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AuthUser } from '../decorators/auth-user.decorator';
import { SuperAdminGuard } from '../guard/super-admin.guard';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserService } from './user.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('user')
@UseGuards(SuperAdminGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiCreatedResponse({
      type: User ,
      status:HttpStatus.CREATED,
    })
    
  @Post()
  async create(@Body() createUserDto: CreateUserDto,@Res() res) {
    await this.userService.create(createUserDto);
    return res.status(HttpStatus.OK).json({message:'User has been created successfully'})

  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
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
  async update(@Param('id',ParseObjectIdPipe) id,@Res() res,@Body() updateUserDto: UpdateUserDto) {
   
    try {
      await this.userService.update(id,updateUserDto);
      return res.status(HttpStatus.OK).json({message:'User has been updated successfully'})

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @ApiOkResponse({
    type: User ,
    status:HttpStatus.OK
  })

  @ApiBadRequestResponse({
    description:"the id  is not type of ObjectId",
    status:HttpStatus.BAD_REQUEST
  })

  @ApiParam({name: 'id',type:Types.ObjectId})

  
  @Get(":id")
  async findbyId(@Param('id',ParseObjectIdPipe) id,@Res() res): Promise<User> {
     
   const userEntity = await  this.userService.findById(id);
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
    
    if(user.id == id)
    return res.status(HttpStatus.BAD_REQUEST).json({message:'You can\'t delete your account  '});

    const userDeleted =  await this.userService.deleteUserByQuery({_id:id});

    if(!userDeleted)
    return res.status(HttpStatus.BAD_REQUEST).json({message:'User Doesn\'t exist '});

  return res.status(HttpStatus.OK).json({message : "User deleted with sucess"} );
  }
}
