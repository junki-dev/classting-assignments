import { PartialType, PickType } from '@nestjs/swagger';

import { SchoolDocument } from '@schools/models/school.schema';

export class CreateSchoolPageDto extends PartialType(
  PickType(SchoolDocument, ['name', 'location', 'adminId'] as const),
) {}
