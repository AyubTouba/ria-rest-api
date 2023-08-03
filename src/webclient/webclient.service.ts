import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ServerConfig } from '../schemas/serverConfig.schema';
import { WebClient } from '../schemas/webClient.schema';
import { WorkSpace } from '../schemas/workspace.schema';

@Injectable()
export class WebclientService {

    constructor(@InjectModel(WebClient.name) private readonly webClient: Model<WebClient>,
    @InjectModel(WorkSpace.name) private readonly workSpaceModel: Model<WorkSpace>,
    @InjectModel(ServerConfig.name) private readonly serverConfig: Model<ServerConfig>,
) {}

        async findByWorkSpace(organization: Types.ObjectId, query: any,webclients:Array<any>= null): Promise<WebClient[]> {

            try {
                const workspace = await this.workSpaceModel.findById(organization).exec();
               

                const filter: any = {};
                filter.workSpace = workspace._id;
          
                if ('server' in query) {
                  const serverEntity = await this.serverConfig.findById(query.server).exec();
                  filter['server'] = serverEntity._id;
                }
                if(webclients != null)
                {
                    webclients = webclients.map(wb => Types.ObjectId(wb));
                    filter['_id'] ={$in:webclients};
                }
                return await this.webClient.find(filter)
                .populate('workSpace')
                .populate('server')
                .exec(); 
            } catch (error) {
                throw new BadRequestException(error);   
            }

        }

        async findById(organization: Types.ObjectId,id:Types.ObjectId): Promise<WebClient> {
            try {
                const workspace = await this.workSpaceModel.findById(organization).exec();
                return await this.webClient.findOne({workSpace:workspace._id,_id:id})
                .populate('workSpace')
                .populate('server')
                .exec();
            } catch (error) {
                throw new BadRequestException(error);    
            }

        }
        
        async findByServer(organization: Types.ObjectId,server:Types.ObjectId): Promise<WebClient[]> {
            try {
                const workspace = await this.workSpaceModel.findById(organization).exec();
                const serverEntiy = await this.serverConfig.findById(server).exec();
                return await this.webClient.find({workSpace:workspace._id,server:serverEntiy})
                .populate('workSpace')
                .populate('server')
                .exec();
            } catch (error) {
                throw new BadRequestException(error);    
            }

        }
}
