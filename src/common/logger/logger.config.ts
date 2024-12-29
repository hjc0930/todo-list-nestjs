import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
  }),
];

// 仅在生产环境中添加文件传输器
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: 'logs', // 日志文件目录
      filename: '%DATE%.log', // 使用日期命名日志文件
      datePattern: 'YYYY-MM-DD', // 日期格式
      zippedArchive: true, // 是否压缩归档
      maxSize: '20m', // 每个日志文件的最大大小
      maxFiles: '14d', // 保留14天的日志文件
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}

export const winstonConfig = {
  transports,
};
