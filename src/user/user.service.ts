import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { BusinessException } from '../common/response/business.exception';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`尝试创建用户: ${createUserDto.userName}`);

    const existingUser = await this.userRepository.findOne({
      where: { userName: createUserDto.userName },
    });

    if (existingUser) {
      this.logger.warn(`用户创建失败: 用户名 ${createUserDto.userName} 已存在`);
      throw new BusinessException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(`用户创建成功: ${savedUser.userName}`);
  }

  async login(loginUserDto: LoginUserDto) {
    this.logger.log(`尝试登录用户: ${loginUserDto.userName}`);

    const user = await this.userRepository.findOne({
      where: { userName: loginUserDto.userName },
    });

    if (!user) {
      this.logger.warn(`登录失败: 用户名 ${loginUserDto.userName} 不存在`);
      throw new BusinessException('用户名或密码错误', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`登录失败: 用户 ${loginUserDto.userName} 密码错误`);
      throw new BusinessException('用户名或密码错误', 401);
    }

    const payload = { sub: user.id, username: user.userName };
    const access_token = this.jwtService.sign(payload);

    this.logger.log(`用户登录成功: ${user.userName}`);
    return { access_token };
  }

  async findOne(id: number) {
    this.logger.debug(`查询用户信息: ID ${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`用户不存在: ID ${id}`);
    }
    return user;
  }

  async getCurrentUser(): Promise<User> {
    const { id } = this.request.user as { id: number };
    const currentUser = await this.findOne(id);
    if (!currentUser) {
      this.logger.error(`当前用户不存在: ID ${id}`);
      throw new BusinessException('当前用户不存在');
    }

    return currentUser;
  }
}
