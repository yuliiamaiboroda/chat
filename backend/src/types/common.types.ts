import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ type: Number })
  page?: number;

  @ApiProperty({ type: Number })
  limit?: number;
}

export class PaginationForDB {
  skip: number;
  take: number;
}

export class getTotalPagesDto {
  total: number;
  limit: number;
}
