import { Controller, UseGuards, Get, HttpStatus, Param, Res, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-objectid.pipe';
import { AuthUser } from '../decorators/auth-user.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { LogRequest } from '../schemas/logRequest.schema';
import { LogrequestService } from './logrequest.service';

@ApiTags('LogRequets')
@ApiBearerAuth()
@Controller('logrequest')
@UseGuards(AuthGuard)
export class LogrequestController {

    constructor(private readonly logrequestService: LogrequestService) {}


    @ApiOkResponse({
      type: LogRequest ,
      status:HttpStatus.OK,
      isArray:true
    })
  
    @ApiQuery({ name: 'final_status',description:"404,500,200,...",required:false,example:"404" })
    @ApiQuery({ name: 'request_method',description:"get,post,put,delete",required:false,example:"post" })
    @ApiQuery({ name: 'remote_user',description:"IP Adresse",required:false })
   
    @Get('count')
  async getCount(@Res() res,@AuthUser() user,@Query() query) {
  
    if(!Types.ObjectId.isValid(user.organization))
    return res.status(HttpStatus.BAD_REQUEST).json({message:'the organization is not type of ObjectId'});
  
    const logRequets = await this.logrequestService.getCountLogRequest(user.organization,query,user.webclients);
    return res.status(HttpStatus.OK).json(logRequets);
  }

    @ApiOkResponse({
      type: LogRequest ,
      status:HttpStatus.OK,
      isArray:true
    })
    
    @ApiBadRequestResponse({
      description:"the webClient param is not type of ObjectId",
      status:HttpStatus.BAD_REQUEST
    })

    @ApiNotFoundResponse({
      description:'the webclient doesn\'t exist ',
      status:HttpStatus.NOT_FOUND
    })

    @ApiQuery({ name: 'final_status',description:"404,500,200,...",required:false,example:"404" })
    @ApiQuery({ name: 'request_method',description:"get,post,put,delete",required:false,example:"post" })
    @ApiQuery({ name: 'remote_user',description:"IP Adresse",required:false })

    @ApiParam({name: 'webClientId',type:Types.ObjectId,required:true})
   
    @Get(':webClientId')
  async getLogRequestsByWebClient(@Param('webClientId',ParseObjectIdPipe) webClientId ,@Res() res,@AuthUser() user,@Query() query) {

    if(!Types.ObjectId.isValid(user.organization))
    return res.status(HttpStatus.BAD_REQUEST).json({message:'the organization is not type of ObjectId'});

    if(user.webclients && !user.webclients.includes(webClientId))
    return res.status(HttpStatus.OK).json([]);

    const logRequets = await this.logrequestService.findByWebClient(user.organization,webClientId,query,user.webclients);
    return res.status(HttpStatus.OK).json(logRequets);
  }
  


  
  @ApiOkResponse({
    type: LogRequest ,
    status:HttpStatus.OK,
    isArray:true
  })
  
  @ApiBadRequestResponse({
    description:"the webClient param is not type of ObjectId",
    status:HttpStatus.BAD_REQUEST
  })

  @ApiNotFoundResponse({
    description:'the webclient doesn\'t exist ',
    status:HttpStatus.NOT_FOUND
  })

  @ApiQuery({ name: 'final_status',description:"404,500,200,...",required:false,example:"404" })
  @ApiQuery({ name: 'request_method',description:"GET,POST,...",required:false,example:"get" })
  @ApiQuery({ name: 'remote_user',description:"Adress IP",required:false })
  @ApiQuery({ name: 'referer',description:"referer",required:false })
  @ApiQuery({ name: 'user_agent',description:"user_agent",required:false })

  @ApiParam({name: 'webClientId',type:Types.ObjectId})

  @Get('groupby/:webClientId')
  async getMaxByWebClientAndIlogData(@Param('webClientId',ParseObjectIdPipe) webClientId ,@Res() res,@AuthUser() user,@Query() query) {

    if(!Types.ObjectId.isValid(user.organization))
    return res.status(HttpStatus.BAD_REQUEST).json({message:'the workspace param is not type of ObjectId'});

    if(user.webclients && !user.webclients.includes(webClientId))
    return res.status(HttpStatus.OK).json([]);
    
    const logRequets = await this.logrequestService.groubByWebClientAndIlogData(user.organization,webClientId,query);
    return res.status(HttpStatus.OK).json(logRequets);
  }

 
  
  @ApiOkResponse({
    type: LogRequest ,
    status:HttpStatus.OK,
    isArray:true
  })
  
  @ApiBadRequestResponse({
    description:"the webClient param is not type of ObjectId",
    status:HttpStatus.BAD_REQUEST
  })

  @ApiNotFoundResponse({
    description:'the webclient doesn\'t exist ',
    status:HttpStatus.NOT_FOUND
  })

  @ApiQuery({ name: 'groupby',description:"hour,day,second,milliseconds,...",required:false,example:"second" })
  @ApiQuery({ name: 'final_status',description:"404,500,200,...",required:false })
  @ApiQuery({ name: 'request_method',description:"get,post,put,delete",required:false })
  @ApiQuery({ name: 'remote_user',description:"Adress IP",required:false })
  @ApiParam({name: 'webClientId',type:Types.ObjectId})

  @Get('groupbydate/:webClientId')
  async getMaxByWebClientAnDate(@Param('webClientId',ParseObjectIdPipe) webClientId ,@Res() res,@AuthUser() user,@Query() query) {
   
    if(user.webclients && !user.webclients.includes(webClientId))
    return res.status(HttpStatus.OK).json([]);

    const logRequets = await this.logrequestService.groubByWebClientAndDate(user.organization,webClientId,query);
    return res.status(HttpStatus.OK).json(logRequets);
  }
}
