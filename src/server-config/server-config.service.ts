import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ServerConfig } from '../schemas/serverConfig.schema';
import { WorkSpace } from '../schemas/workspace.schema';

@Injectable()
export class ServerConfigService {

    constructor(@InjectModel(ServerConfig.name) private readonly serverConfig: Model<ServerConfig>,
    @InjectModel(WorkSpace.name) private readonly workSpaceModel: Model<WorkSpace>,
) {}

        async findByWorkSpace(organization: Types.ObjectId): Promise<ServerConfig[]> {
            try {
             const workspace = await this.workSpaceModel.findById(organization).exec();
            return await this.serverConfig.find({workSpace:workspace._id}).populate('workSpace').exec();
            } catch (error) {
                throw new BadRequestException(error);   
            }
        }

        async findById(organization: Types.ObjectId,id:Types.ObjectId): Promise<ServerConfig> {
            try {
                const workspace = await this.workSpaceModel.findById(organization).exec();
                return await this.serverConfig.findOne({workSpace:workspace._id,_id:id}).populate('workSpace').exec();
            
            } catch (error) {
                throw new BadRequestException(error);   
            }
    }
}
