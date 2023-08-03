import { PartialType } from "@nestjs/swagger";
import { CreateWorkSpaceUserDto } from "./create.workspace.dto";

export class UpdateWorkSpaceUserDto  extends PartialType(CreateWorkSpaceUserDto) {
  workSpace: any;

  }