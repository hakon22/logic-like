import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, DeleteDateColumn, CreateDateColumn, UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { IdeaEntity } from '@backend/db/entities/idea.entity';

/** Голоса */
@Entity({ name: 'vote' })
@Unique(['ipAddress', 'idea'])
export class VoteEntity extends BaseEntity {
  /** Уникальный `id` голоса */
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  /** Дата создания голоса */
  @CreateDateColumn()
  public created: Date;

  /** Дата изменения голоса */
  @UpdateDateColumn()
  public updated: Date;

  /** Дата удаления голоса */
  @DeleteDateColumn()
  public deleted: Date;

  /** IP адрес, с которого было голосование */
  @Column('inet', {
    name: 'ip_address',
  })
  public ipAddress: string;

  /** Идея */
  @Index('vote__idea_idx')
  @ManyToOne(() => IdeaEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idea_id',
  })
  public idea: IdeaEntity;
}
