import type { EntityManager } from 'typeorm';

export interface IdeaOptionsInterface {
  /** TypeORM Entity Manager */
  manager?: EntityManager;
  /** Взять только `id` */
  onlyIds?: boolean;
  /** Включить `ids` */
  includeIds?: number[];
  /** IP адрес пользователя */
  ipAddress?: string;
}
