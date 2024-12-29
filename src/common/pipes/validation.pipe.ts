import {
  ValidationPipe,
  type ValidationPipeOptions,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import type { Response } from '../response/response.interface';

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    const messages = errors.map((error) => ({
      field: error.property,
      message: Object.values(error.constraints || {}).join(', '),
    }));

    const response: Response = {
      code: HttpStatus.UNPROCESSABLE_ENTITY,
      message: messages.map((message) => message.message).join(', '),
    };

    throw new BadRequestException(response);
  },
};

export const ValidationPipeInstance = new ValidationPipe(validationPipeOptions);
