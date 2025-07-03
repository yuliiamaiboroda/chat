import { PaginationDto, PaginationForDB } from 'src/types/common.types';

export const normalizePaginationForDB = (
  data: PaginationDto,
): PaginationForDB => {
  const { page, limit } = data;
  const skip = (page - 1) * limit;

  return { skip, take: limit };
};
