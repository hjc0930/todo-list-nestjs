import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度必须在3-50个字符之间' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: '用户名只能包含字母、数字、下划线和横线',
  })
  userName: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Length(6, 100, { message: '密码长度必须在6-100个字符之间' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message: '密码必须包含大小写字母和数字',
  })
  password: string;

  @IsNotEmpty({ message: '确认密码不能为空' })
  @Match('password', { message: '两次输入的密码不一致' })
  confirmPassword: string;
}
