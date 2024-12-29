import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// 根据环境加载配置文件
const env = process.env.NODE_ENV || 'local';
dotenv.config({ path: `.env.${env}` });

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
