import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LogRequest } from '../schemas/logRequest.schema';
import { WebClient } from '../schemas/webClient.schema';
import { WorkSpace } from '../schemas/workspace.schema';

@Injectable()
export class LogrequestService {
  
  constructor(
    @InjectModel(WebClient.name)
    private readonly webClientModel: Model<WebClient>,
    @InjectModel(LogRequest.name)
    private readonly logRequestModel: Model<LogRequest>,
    @InjectModel(WorkSpace.name)
    private readonly workSpaceModel: Model<WorkSpace>,
  ) {}

  async findByWebClient(
    organization: Types.ObjectId,
    webClientId: Types.ObjectId,
    query: any,
    webclients:Array<any>= null
  ): Promise<LogRequest[]> {
    try {
      const workspace = await this.workSpaceModel.findById(organization).exec();
      const webClient = await this.webClientModel.findById(webClientId).exec();

      let filter: any = {};
      filter.webclient = webClient._id;

       
    // Check the type of query (querytype) 
    if ('querytype' in query) {
        switch (query.querytype) {
          case 'groupby':
              return  await this.groubByWebClientAndIlogData(organization,webClientId,query);
          case 'groupbydate':
              return  await this.groubByWebClientAndDate(organization,webClientId,query);
          case 'count':
               return  await this.getCountLogRequest(organization,query,webclients);
        }
    }

    filter = this.getQueryFilter(query,filter);
      const logrequest = this.logRequestModel
        .find(filter)
        .populate('webclient');
        
      if ('limit' in query) {
        const valLimit = parseInt(query.limit);
        if (!isNaN(valLimit)) {
          logrequest.limit(valLimit);
        }
      }

      var logrequests:LogRequest[] =  await logrequest.exec();
      return logrequests.filter(lr => String(lr.webclient.workSpace._id) === String(workspace._id) )
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async groubByWebClientAndIlogData(
    organization: Types.ObjectId,
    webClientId: Types.ObjectId,
    query: any,
  ): Promise<LogRequest[]> {
    try {

      let filter = '$logs.FINAL_STATUS';
      const limit: any = '';
      if ('groupby' in query) {
        let groupby = query.groupby;
        if (groupby == 'request_method') {
          filter = '$logs.REQUEST_METHOD';
        }
        if (groupby == 'remote_user') {
          filter = '$logs.REMOTE_USER';
        }
        if (groupby == 'user_agent') {
          filter = '$logs.USER_AGENT';
        }
        if (groupby == 'referer') {
          filter = '$logs.REFERER';
        }
        if (groupby == 'final_status') {
          filter = '$logs.FINAL_STATUS';
        }


      }
  
      //  let workspace = await this.workSpaceModel.findById(organization).exec();
  
      const webClient = await this.webClientModel.findById(webClientId).exec();
      return await this.logRequestModel.aggregate([
        { $match: { webclient: webClient._id } },
        {
          $group: {
            _id: filter,
            data: { $sum: 1 },
          },
        },
        { $sort: { data: -1 } },
      ]);

    
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async groubByWebClientAndDate(
    organization: Types.ObjectId,
    webClientId: Types.ObjectId,
    query: any,
  ): Promise<LogRequest[]> {
    try {
      let filter = 'minute';
      const limit: any = '';
      if ('groupby' in query) 
          filter = query.groupby;
      
         
      //  let workspace = await this.workSpaceModel.findById(organization).exec();
      const webClient = await this.webClientModel.findById(webClientId).exec();
      let $match: any = {};
      $match.webclient = webClient._id;

      $match = this.getQueryFilter(query,$match);

      let result =  await this.logRequestModel.aggregate([
        { $match:$match },
        this.getGroupByDateFormat(filter)
      ]);

     return result.map(dt => {
      dt.date = dt.data[0].created_at;
      return dt;
     }).sort((a:any,b:any) => new Date (a.data[0].created_at).getTime() - new Date (b.data[0].created_at).getTime());

    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //Should Check how to filter inside the aggregation 
 async getCountLogRequest(organization: Types.ObjectId,query: any,webclients:Array<any>= null
    ): Promise<LogRequest[]> {
      const workspace = await this.workSpaceModel.findById(organization).exec();
      var $match: any = {};
      const $matchWebclient: any = {};
      const $group: any = {};
      $group['_id'] = {}
      $group['_id']['webclient'] = "$webclient";
    
      if(webclients != null)
      {
          webclients = webclients.map(wb => Types.ObjectId(wb));
          $match['_id'] ={$in:webclients};
      }

     $match =  this.getQueryFilter(query,$match);
      if ('final_status'.toLowerCase() in query) 
        $group['_id']['FINAL_STATUS'] = "$logs.FINAL_STATUS";
      

      if ('request_method'.toLowerCase() in query) 
        $group['_id']['REQUEST_METHOD'] = query.request_method.toUpperCase();
     

      $group['sum'] = { $sum: 1};
      $matchWebclient['webclient.workSpace'] = workspace._id;
      var result = await this.logRequestModel.aggregate([
        {$match : $match},
        { $group: $group},
        { $lookup: {from: 'webclients', localField: '_id.webclient', foreignField: '_id', as: 'webclient'} },
        {$match : $matchWebclient},
      ]);
      
      result = result.map(dt =>({sum:dt.sum,webclient:dt.webclient[0].domain,name:dt.webclient[0].server_name}))
      return result;
  }

  private getGroupByDateFormat(
    format: string = 'minute'
  ) {
    switch (format) {
      case 'hour':
        return {
          $group: {
            _id: {
              h: { $hour: '$created_at' },
              d: { $dayOfMonth: '$created_at' },
              m: { $month: '$created_at' },
              y: { $year: '$created_at' },
            },
            data: { $push: '$$ROOT' } 
          },
        };
      case 'second':
        return {
            $group: {
                _id: {
                  s: {  $second: '$created_at' },
                  mi: { $minute: '$created_at' },
                  h: { $hour: '$created_at' },
                  d: { $dayOfMonth: '$created_at' },
                  m: { $month: '$created_at' },
                  y: { $year: '$created_at' },
                },
                data: { $push: '$$ROOT' } 
              },
            };
       case 'milliseconds':
            return {
                $group: {
                    _id: {
                      ms: {  $milliseconds: '$created_at' },
                      s: {  $second: '$created_at' },
                      mi: { $minute: '$created_at' },
                      h: { $hour: '$created_at' },
                      d: { $dayOfMonth: '$created_at' },
                      m: { $month: '$created_at' },
                      y: { $year: '$created_at' },
                    },
                    data: { $push: '$$ROOT' } 
                  },
                };
      case 'day':
        return {
          $group: {
            _id: {
              d: { $dayOfMonth: '$created_at' },
              m: { $month: '$created_at' },
              y: { $year: '$created_at' },
            },
            data: { $push: '$$ROOT' } 
          },
        };
      default:
        return {
          $group: {
            _id: {
              mi: { $minute: '$created_at' },
              h: { $hour: '$created_at' },
              d: { $dayOfMonth: '$created_at' },
              m: { $month: '$created_at' },
              y: { $year: '$created_at' },
            },
            data: { $push: '$$ROOT' } 
          },
        };
    }
  }

  private getQueryFilter(query,$match){
     
    if ('final_status'.toLowerCase() in query) {
        
        if(query.final_status.includes(',')){
          var finalStatusList = query.final_status.split(",");
          $match['logs.FINAL_STATUS'] = { "$in" : finalStatusList };
        }else {
          $match['logs.FINAL_STATUS'] = query.final_status;
        }
     
    }
    if ('request_method'.toLowerCase() in query) {

      if(query.request_method.includes(',')){
        var request_methodList = query.request_method.split(",");
        $match['logs.REQUEST_METHOD'] = { "$in" : request_methodList };
      }else {
        $match['logs.REQUEST_METHOD'] = query.final_status.toUpperCase();;
      }
    }
    if ('remote_user'.toLowerCase() in query) {
      $match['logs.REMOTE_USER'] = query.remote_user;
    }
    if ('startdate'.toLowerCase() in query && 'enddate'.toLowerCase() in query) {
      $match.created_at = { '$gte': new Date(query.startdate),
                            '$lte': new Date(query.enddate)};
    }
    return $match;
  }
}
