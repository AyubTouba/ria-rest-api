import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type WorkSpaceDocument = WorkSpace & Document;

@Schema()
export class WorkSpace extends Document  {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop({default: Date.now})
  @ApiProperty()
  created_at?: Date;

  // Doesn't implemented yet
  @Prop({default: true})
  @ApiProperty()
  is_active?: boolean;
}

export const WorkSpaceSchema = SchemaFactory.createForClass(WorkSpace);