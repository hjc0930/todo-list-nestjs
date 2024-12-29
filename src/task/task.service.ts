import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserService } from 'src/user/user.service';
import { BusinessException } from 'src/common/response/business.exception';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  private readonly logger = new Logger(TaskService.name);

  async create(createTaskDto: CreateTaskDto) {
    // 获取当前用户
    const { id: userId } = await this.userService.getCurrentUser();

    // 检查待办事项是否已存在
    const existTask = await this.taskRepository.findOne({
      where: {
        userId,
        title: createTaskDto.title,
      },
    });
    if (existTask) {
      this.logger.warn(`待办事项已存在: ${createTaskDto.title}`);
      throw new BusinessException('待办事项已存在');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      userId,
    });
    await this.taskRepository.save(task);
    this.logger.log(`创建待办成功: ${createTaskDto.title}`);
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    const { id: userId } = await this.userService.getCurrentUser();
    const currentTask = await this.taskRepository.findOne({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!currentTask) {
      this.logger.error(`待办事项不存在: ID ${taskId}`);
      throw new BusinessException('待办事项不存在');
    }

    await this.taskRepository.update(taskId, { ...updateTaskDto });
    this.logger.log(`更新待办成功: ID ${taskId}`);
  }
  async delete(taskId: number) {
    const { id: userId } = await this.userService.getCurrentUser();
    const currentTask = await this.taskRepository.findOne({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!currentTask) {
      this.logger.error(`待办事项不存在: ID ${taskId}`);
      throw new BusinessException('待办事项不存在');
    }

    await this.taskRepository.delete(taskId);
    this.logger.log(`删除待办成功: ID ${taskId}`);
  }

  async findOne(taskId: number) {
    const { id: userId } = await this.userService.getCurrentUser();
    const currentTask = await this.taskRepository.findOne({
      where: {
        id: taskId,
        userId,
      },
    });
    if (!currentTask) {
      this.logger.error(`待办事项不存在: ID ${taskId}`);
      throw new BusinessException('待办事项不存在');
    }
    return currentTask;
  }

  async findPage(page: number, pageSize: number) {
    const { id: userId } = await this.userService.getCurrentUser();

    const [list, total] = await this.taskRepository.findAndCount({
      where: {
        userId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    this.logger.log(`查询待办成功: 页码 ${page}, 页大小 ${pageSize}`);

    return {
      page,
      pageSize,
      total,
      list,
    };
  }
}
