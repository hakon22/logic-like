import type { PaginationQueryInterface } from '@backend/types/pagination.query.interface';

export interface IdeaQueryInterface extends PaginationQueryInterface {
  /** `id` идеи */
  id?: number;
  /** С удалёнными */
  withDeleted?: boolean;
}
