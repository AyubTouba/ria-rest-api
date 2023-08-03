import { Controller, Get, HttpStatus, Param, Res, UseGuards, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserGuard } from '../guard/user.guard';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { WebClient } from '../schemas/webClient.schema';
import { WebclientService } from './webclient.service';

@ApiTags('webTracker')
@ApiBearerAuth()
@Controller('webclient')
@UseGuards(UserGuard)
export class WebclientController {

    constructor(private readonly webclientService: WebclientService) {}


    @ApiOkResponse({
      type: WebClient ,
      status:HttpStatus.OK,
      isArray:true
    })
    @ApiBadRequestResponse({
      description:"the workspace  is not type of ObjectId",
      status:HttpStatus.BAD_REQUEST
    })
    @ApiQuery({ name: 'server',description:"_id server",required:false })

  @Get('')
  async getWebClients(@Res() res,@AuthUser() user,@Query() query) {

    if(!Types.ObjectId.isValid(user.organization))
    return res.status(HttpStatus.BAD_REQUEST).json({error:'the workspace is not type of ObjectId'});

    const webClients = await this.webclientService.findByWorkSpace(user.organization,query,user.webclients);
    return res.status(HttpStatus.OK).json(webClients);
  }

  @Get(':id')
  @ApiOkResponse({
    type: WebClient ,
    isArray:false,
    status:HttpStatus.OK
  })
  @ApiBadRequestResponse({
    description:"the id param is not type of ObjectId",
    status:HttpStatus.BAD_REQUEST
  })
  @ApiParam({name: 'id',type:Types.ObjectId})
  async getWebClientbyId(@Param('id',ParseObjectIdPipe) id,@Res() res,@AuthUser() user) {
         
    if(user.webclients && !user.webclients.includes(id))
    return res.status(HttpStatus.OK).json([]);

    const webClient = await this.webclientService.findById(user.organization,id);

    return res.status(HttpStatus.OK).json(webClient ? webClient : []);
  }


}
