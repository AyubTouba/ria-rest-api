import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { ServerConfigSchema, ServerConfig } from './serverConfig.schema';
import { WorkSpace, WorkSpaceSchema } from './workspace.schema';


@Schema()
export class WebClient extends Document {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  domain: string;

  @Prop()
  @ApiProperty()
  ip_client: string;

  @Prop()
  @ApiProperty()
  lastline: number;

  @Prop()
  @ApiProperty()
  virtual_host_file: string;

  @Prop()
  @ApiProperty()
  path_log_folder: string;

  @Prop()
  @ApiProperty()
  conf_tracker_file: string;

  @Prop()
  @ApiProperty()
  is_configured: boolean;

  @Prop()
  @ApiProperty()
  is_deleted: boolean;

  @Prop()
  @ApiProperty()
  logFile: string;

  @Prop()
  @ApiProperty()
  server_name: string;

  @Prop({ type: Types.ObjectId, ref: 'WorkSpace'} )
  @ApiProperty()
  workSpace:WorkSpace;

  @Prop({ type: Types.ObjectId, ref: 'ServerConfig'} )
  @ApiProperty()
  server: ServerConfig;
  
  @Prop()
  @ApiProperty()
  created_at: Date;
}

export const WebClientSchema = SchemaFactory.createForClass(WebClient);