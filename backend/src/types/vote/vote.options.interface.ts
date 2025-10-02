import type { EntityManager } from 'typeorm';

export interface VoteOptionsInterface {
  /** TypeORM Entity Manager */
  manager?: EntityManager;
  /** `id` идеи */
  ideaId?: number;
}
