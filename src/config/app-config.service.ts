import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
require('dotenv').config();

@Injectable()
export class AppConfigService {

    constructor(private configService: ConfigService) {}

   
    public getMongoQuery() {
        return `${this.configService.get('MONGO_SERVER')}/${this.configService.get('MONGO_SERVER')}`;
    }
 
}

