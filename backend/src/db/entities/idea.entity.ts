import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';

import { VoteEntity } from '@backend/db/entities/vote.entity';

/** Идеи */
@Entity({ name: 'idea' })
export class IdeaEntity extends BaseEntity {
  /** Уникальный `id` идеи */
  @PrimaryGeneratedColumn()
  public id: number;

  /** Дата создания идеи */
  @CreateDateColumn()
  public created: Date;

  /** Дата изменения идеи */
  @UpdateDateColumn()
  public updated: Date;

  /** Дата удаления идеи */
  @DeleteDateColumn()
  public deleted: Date;

  /** Заголовок идеи */
  @Column('character varying')
  public title: string;

  /** Описание идеи */
  @Column('text')
  public description: string;

  /** Голоса */
  @OneToMany(() => VoteEntity, vote => vote.idea)
  public votes: VoteEntity[];

  /** Статус конкретного пользователя (не колонка!) */
  public isVoted: boolean;

  /** Количество голосов (не колонка!) */
  public votesCount: number;
}
