import { DataSource } from 'typeorm';
import { Singleton } from 'typescript-ioc';

import { entities } from '@backend/db/entities';
import { TypeormLogger } from '@backend/db/typeorm.logger';
import 'dotenv/config';

const {
  DB = 'LOCAL',
  DB_LOCAL = '',
  DB_HOST = '',
  USER_DB_LOCAL = '',
  PASSWORD_DB_LOCAL = '',
  USER_DB_HOST = '',
  PASSWORD_DB_HOST = '',
} = process.env;

export const databaseConfig = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: DB === 'LOCAL' ? USER_DB_LOCAL : USER_DB_HOST,
  password: DB === 'LOCAL' ? PASSWORD_DB_LOCAL : PASSWORD_DB_HOST,
  database: DB === 'LOCAL' ? DB_LOCAL : DB_HOST,
  logger: new TypeormLogger(),
  schema: 'idea',
  synchronize: false,
  logging: true,
  entities,
  subscribers: [],
  migrations: ['./src/db/migrations/*.ts'],
});

@Singleton
export abstract class DatabaseService {
  private db: DataSource;

  constructor() {
    this.db = databaseConfig;
  }

  public getManager = () => {
    if (!this.db.isInitialized) {
      throw new Error('Database connection is not initialized. Please call init() first.');
    }
    return this.db.createEntityManager();
  };

  public init = async () => {
    try {
      await this.db.initialize();
      console.log('The connection to PostgreSQL was established successfully.');
    } catch (e) {
      console.log('Unable to connect to PostgreSQL: ', e);
    }
  };
}
