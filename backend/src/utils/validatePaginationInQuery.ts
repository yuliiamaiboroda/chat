import { BadRequestException } from '@nestjs/common';
import { PaginationDto } from 'src/types/common.types';

export const validatePaginationInQuery = (
  data: PaginationDto,
): PaginationDto => {
  const { limit = 10, page = 1 } = data;

  if (!limit || !page) throw new BadRequestException();
  if (isNaN(Number(limit)) || isNaN(Number(page)))
    throw new BadRequestException();
  if (Number(limit) < 1 || Number(page) < 1) throw new BadRequestException();

  return {
    limit: Number(limit),
    page: Number(page),
  };
};
