import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { JwtModule } from '@nestjs/jwt';

const genEnvFIlePath = () => {
  const env = process.env.NODE_ENV;
  if (!env) {
    return '.env';
  }
  return `.env.${env}`;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: genEnvFIlePath(),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV !== 'production',
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('APP_JWT_SECRET');
        const expiresIn = configService.get<string>('APP_JWT_EXPIRES_IN');
        if (!secret) {
          throw new Error(
            'JWT_SECRET must be defined in environment variables',
          );
        }
        return {
          secret,
          signOptions: { expiresIn: expiresIn || '7d' },
        };
      },
    }),
    UserModule,
    TaskModule,
  ],
})
export class AppModule {}
