import { IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';

enum UserType {
  USER = 'user',
  ADMIN = 'admin',
}

export class UserAuthDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly uid: string;

  @IsNotEmpty()
  @IsEnum(UserType, {
    message: 'User Type must be either user or admin',
  })
  readonly user_type: UserType;
}
