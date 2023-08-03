import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { ROLES } from '../utils/roles.enum';
import { WorkSpaceSchema, WorkSpace } from './workspace.schema';


@Schema()
export class User  extends Document  {
  @Prop()
  @ApiProperty()
  username: string;

  @Prop()
  @ApiProperty()
  email: string;

  @Prop()
  @ApiProperty()
  password: string;

  @Prop()
  @ApiProperty()
  role: ROLES;

  @Prop({ type: Types.ObjectId, ref: 'WorkSpace'} )
  @ApiProperty()
  workSpace:WorkSpace;

  @Prop({default: Date.now})
  @ApiProperty()
  created_at?: Date;
 
  
  @Prop({default: true})
  @ApiProperty()
  is_active?: boolean;

  @Prop()
  @ApiProperty()
  webClients?: Array<Types.ObjectId>;

}

export const UserSchema = SchemaFactory.createForClass(User);