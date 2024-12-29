import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum TaskStatus {
  TODO,
  DOING,
  DONE,
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'title',
    length: 100,
  })
  title: string;

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string;

  @Column({
    name: 'status',
    type: 'int',
    default: TaskStatus.TODO,
    comment: '任务状态, 0: 待办, 1: 进行中, 2: 完成',
  })
  status: TaskStatus;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({
    name: 'create_time',
    nullable: true,
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'update_time',
    nullable: true,
  })
  updateTime: Date | null;

  @DeleteDateColumn({
    name: 'delete_at',
    nullable: true,
  })
  deleteAt: Date | null;
}
