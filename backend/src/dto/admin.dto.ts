import { IsEmail, Length, IsNotEmpty, IsOptional, IsMobilePhone } from 'class-validator';

export class AdminRegisterDto {
  @Length(4, 50)
  @IsNotEmpty()
  username: string;

  @Length(8, 100)
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  employeeId: string;
}

export class AdminLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}