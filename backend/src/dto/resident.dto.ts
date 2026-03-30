import {
  IsEmail,
  Length,
  IsNotEmpty,
  IsOptional,
  IsMobilePhone,
  IsIn,
  IsDateString
} from 'class-validator';

export class ResidentRegisterDto {
  @Length(4, 50)
  @IsNotEmpty()
  username!: string;

  @Length(8, 100)
  @IsNotEmpty()
  password!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  fullName!: string;

  @IsNotEmpty()
  address!: string;

  @IsMobilePhone()
  @IsNotEmpty()
  contactNumber!: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsIn(['Male', 'Female', 'Other'])
  gender?: string;

  @IsOptional()
  @IsIn(['Single', 'Married', 'Widowed', 'Divorced'])
  civilStatus?: string;
}

export class ResidentLoginDto {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password!: string;
}

export class CreateResidentDto extends ResidentRegisterDto {}

export class UpdateResidentProfileDto {
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsMobilePhone()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsIn(['Male', 'Female', 'Other'])
  gender?: string;

  @IsOptional()
  @IsIn(['Single', 'Married', 'Widowed', 'Divorced'])
  civilStatus?: string;
}