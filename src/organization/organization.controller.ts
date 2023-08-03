import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { SuperAdminGuard } from '../guard/super-admin.guard';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { WorkSpace } from '../schemas/workspace.schema';
import { CreateOrganizationDto } from './dtos/createOrganization.dto';
import { UpdateOrganizationDto } from './dtos/updateOrganization.dto';
import { WokrSpaceService } from './workspace.service';

@ApiTags('webTracker')
@ApiBearerAuth()
@Controller('workspace')
@UseGuards(SuperAdminGuard)
export class WorkspaceController {

    constructor(private readonly workSpaceService: WokrSpaceService) {}
    

    @ApiCreatedResponse({
      type: WorkSpace,
      status:HttpStatus.CREATED,
    })

    @Post()
    async create(@Res() res,@Body() createOrganizationDto: CreateOrganizationDto) {
      try {
        await this.workSpaceService.createOrganization(createOrganizationDto);
        return res.status(HttpStatus.CREATED).json({message:'WorkSpace has been created successfully'})

      } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              error
          });
      }
    }

    @ApiOkResponse({
      type: WorkSpace ,
    })
    @ApiBadRequestResponse({
      description:"the id param  is not type of ObjectId",
      status:HttpStatus.BAD_REQUEST
    })

    @ApiParam({name: 'id',type:Types.ObjectId})

    @Put(":id")
    async update(@Param('id',ParseObjectIdPipe) id,@Res() res,@Body() updateOrganizationDto: UpdateOrganizationDto) {
     
      try {

        await this.workSpaceService.updateOrganization(id,updateOrganizationDto);
        return res.status(HttpStatus.OK).json({message:'WorkSpace has been updated successfully'})

      } catch (error) {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Error Found,please call the administator'
      });
      }
    }
  
    @ApiOkResponse({
      type: WorkSpace ,
      isArray: true,
      status:HttpStatus.OK
    })
  
    @Get()
    async findAll(@Res() res): Promise<WorkSpace[]> {
      const workSpaces=  await this.workSpaceService.findAll();

      return res.status(HttpStatus.OK).json(workSpaces);
    }


    @ApiOkResponse({
      type: WorkSpace ,
      isArray: true,
      status:HttpStatus.OK
    })

    @ApiBadRequestResponse({
      description:"the id param is not type of ObjectId"
    })

    @ApiParam({name: 'id',type:Types.ObjectId})

    @Get(":id")
    async findbyId(@Param('id',ParseObjectIdPipe) id,@Res() res): Promise<WorkSpace> {

      const workSpace =  await this.workSpaceService.findById(id);
    return res.status(HttpStatus.OK).json(workSpace ? workSpace : []);
    }

    @ApiOkResponse({
      type: String ,
    })
    @ApiBadRequestResponse({
      description:"the id  is not type of ObjectId"
    })
    @ApiNotFoundResponse({
      description:'the WorkSpace doesn\'t exist ',
      status:HttpStatus.NOT_FOUND
    })
    @ApiParam({name: 'id',type:Types.ObjectId})

    @Delete(":id")
    async deleteOne(@Param('id',ParseObjectIdPipe) id,@Res() res) {
      
      const workSpace =  await this.workSpaceService.deleteOne(id);
      if(!workSpace)
      return res.status(HttpStatus.BAD_REQUEST).json({error:'WorkSpace Doesn\'t exist '});

    return res.status(HttpStatus.OK).json({message : "Delete WorkSpace with sucess"} );
    }
}
