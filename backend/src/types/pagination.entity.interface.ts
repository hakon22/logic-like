import type { PaginationInterface } from '@backend/types/pagination.interface';

export interface PaginationEntityInterface<T> {
  code: number;
  paginationParams: PaginationInterface;
  items: T[];
}