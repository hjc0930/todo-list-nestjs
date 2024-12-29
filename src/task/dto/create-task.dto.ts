import { IsNotEmpty, IsString, IsEnum, Length } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString({ message: '标题必须是字符串' })
  @Length(1, 50, { message: '标题长度必须在1到10之间' })
  title: string;

  @IsNotEmpty({ message: '内容不能为空' })
  @IsString({ message: '内容必须是字符串' })
  content: string;

  @IsEnum(TaskStatus, { message: '状态必须是有效的任务状态' })
  status: TaskStatus;
}
