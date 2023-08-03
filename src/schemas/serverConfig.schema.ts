import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {  Document, Types } from 'mongoose';
import { WorkSpace, WorkSpaceSchema } from './workspace.schema';


@Schema()
export class ServerConfig extends Document {
  @Prop()
  name: string;

  @Prop()
  @ApiProperty()
  config_file: string;

  @Prop()
  @ApiProperty()
  config_file_tracker: string;

  @Prop()
  @ApiProperty()
  folder_config: string;

  @Prop()
  @ApiProperty()
  folder_config_tracker: string;

  @Prop()
  @ApiProperty()
  is_configured: boolean;

  @Prop()
  @ApiProperty()
  is_deleted: boolean;

  @Prop()
  @ApiProperty()
  server_type: string;

  @Prop({ type: Types.ObjectId, ref: WorkSpace.name} )
  @ApiProperty()
  workSpace:WorkSpace;

  @Prop()
  @ApiProperty()
  created_at: Date;
}

export const ServerConfigSchema = SchemaFactory.createForClass(ServerConfig);