import type { PaginationQueryInterface } from '@backend/types/pagination.query.interface';

export interface PaginationInterface extends PaginationQueryInterface {
  count: number;
}