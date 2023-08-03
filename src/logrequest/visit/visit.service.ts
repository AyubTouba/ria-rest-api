import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LogRequest } from 'src/schemas/logRequest.schema';
import { WebClient } from 'src/schemas/webClient.schema';
import { WorkSpace } from 'src/schemas/workspace.schema';
import { groupBy } from 'src/utils/helper';
var geoip = require('geoip-lite');
@Injectable()
export class VisitService {

    constructor(
        @InjectModel(WebClient.name)
        private readonly webClientModel: Model<WebClient>,
        @InjectModel(LogRequest.name)
        private readonly logRequestModel: Model<LogRequest>,
        @InjectModel(WorkSpace.name)
        private readonly workSpaceModel: Model<WorkSpace>,
      ) {}
    async getVisitByWebClient(
        organization: Types.ObjectId,
        webClientId: Types.ObjectId,
        query: any,
      ): Promise<any[]> {
        try {
          const workspace = await this.workSpaceModel.findById(organization).exec();
          const webClient = await this.webClientModel.findById(webClientId).exec();
    
          let filter: any = {};
          filter.webclient = webClient._id;

         const logrequest =  this.logRequestModel.find(filter).select('logs.REMOTE_HOSTNAME logs.TIME_REQUEST -_id').populate('webclient');
 
    
          var logrequests:any =  await logrequest.exec();
    //return logrequests.map(dt => ({ ...dt._doc, country: "ddd" }))
       logrequests =  logrequests.map((dt:any) => {

            var geo =  geoip.lookup(dt.logs.REMOTE_HOSTNAME);
             let country  = geo == null ? "unknown" : geo.country;
              
             return { ...dt._doc,country: country };
            }).filter(lr => String(lr.webclient.workSpace._id) === String(workspace._id))
        
            return groupBy(logrequests,'country')

        } catch (error) {
          throw new BadRequestException(error);
        }
      }
}
