
import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe {
  transform(value, metadata) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('the param is not type of ObjectId');
    }
    return value;
  }
}