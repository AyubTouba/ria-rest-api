import { Controller, Get, HttpStatus, Res, UseGuards, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AuthUser } from '../decorators/auth-user.decorator';
import { WorkSpaceAdminGuard } from '../guard/workspace-admin.guard';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { ServerConfig } from '../schemas/serverConfig.schema';
import { ServerConfigService } from './server-config.service';

@ApiTags('webTracker')
@ApiBearerAuth()
@Controller('server')
@UseGuards(WorkSpaceAdminGuard)
export class ServerConfigController {

    constructor(private readonly serverConfigService: ServerConfigService) {}

   
  @ApiOkResponse({
    type: ServerConfig ,
    status:HttpStatus.OK,
    isArray:true
  })
  @ApiBadRequestResponse({
    description:"the workspace is not type of ObjectId",
    status:HttpStatus.BAD_REQUEST
  })
  @Get('')
  async getServers(@Res() res,@AuthUser() user): Promise<ServerConfig[]> {

    if(!Types.ObjectId.isValid(user.organization))
      return res.status(HttpStatus.BAD_REQUEST).json({error:'the workspace is not type of ObjectId'});

    const servers = await this.serverConfigService.findByWorkSpace(user.organization);
    return res.status(HttpStatus.OK).json(servers);
  }

 
  @ApiOkResponse({
    type: ServerConfig ,
    status:HttpStatus.OK,
    isArray:false
  })
  @ApiBadRequestResponse({
    description:"the id param is not type of ObjectId",
    status:HttpStatus.BAD_REQUEST
  })

  @ApiParam({name: 'id',type:Types.ObjectId,required:true}) 
  
  @Get(':id')
  async getServerbyId(@Param('id',ParseObjectIdPipe) id,@Res() res,@AuthUser() user) {

        const server = await this.serverConfigService.findById(user.organization,id);

    return res.status(HttpStatus.OK).json(server ? server : []);
  }
}
