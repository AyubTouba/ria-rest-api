import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { IlogData } from '../utils/IlogData';
import { WebClient, WebClientSchema } from './webClient.schema';


@Schema()
export class LogRequest extends Document {

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  logs: IlogData;

  @Prop({ type: Types.ObjectId, ref: 'WebClient'} )
  @ApiProperty()
  webclient: WebClient;
  
  @Prop()
  @ApiProperty()
  created_at: Date;
}

export const LogRequestSchema = SchemaFactory.createForClass(LogRequest);