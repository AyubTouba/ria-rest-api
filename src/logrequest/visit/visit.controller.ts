import { Controller, Get, HttpStatus, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { ParseObjectIdPipe } from 'src/pipes/parse-objectid.pipe';
import { VisitService } from './visit.service';

@ApiTags('Visit')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('visit')
export class VisitController {

    constructor(private readonly visitService: VisitService) {}

    @Get(':webClientId')
    async getVisitByWebClient(@Param('webClientId',ParseObjectIdPipe) webClientId ,@Res() res,@AuthUser() user,@Query() query) {
  
      if(!Types.ObjectId.isValid(user.organization))
      return res.status(HttpStatus.BAD_REQUEST).json({message:'the organization is not type of ObjectId'});
  
      if(user.webclients && !user.webclients.includes(webClientId))
      return res.status(HttpStatus.OK).json([]);
  
      const logRequets = await this.visitService.getVisitByWebClient(user.organization,webClientId,query);
      return res.status(HttpStatus.OK).json(logRequets);
    }
}
