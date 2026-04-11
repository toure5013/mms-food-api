import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@entreprise.ci' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MonMotDePasse123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RequestOtpDto {
  @ApiProperty({ example: 'john.doe@entreprise.ci' })
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'john.doe@entreprise.ci' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '482731' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class SetPasswordDto {
  @ApiProperty({ example: 'john.doe@entreprise.ci' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '482731' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'NouveauMotDePasse123!' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
