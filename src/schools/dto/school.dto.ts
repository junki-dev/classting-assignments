import { OmitType, PartialType } from '@nestjs/swagger';

import { SchoolDocument } from '@schools/models/school.schema';

export class SchoolDto extends PartialType(OmitType(SchoolDocument, ['feedList'] as const)) {}
