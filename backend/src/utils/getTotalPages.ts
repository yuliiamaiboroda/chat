import { getTotalPagesDto } from 'src/types/common.types';

export const getTotalPages = ({ total, limit }: getTotalPagesDto): number => {
  return Math.ceil(total / limit);
};
