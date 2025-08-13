import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsEmail()
  ownerEmail?: string;

  @IsNotEmpty()
  @IsString()
  ownerPhone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  ownerPassword: string;

  @IsOptional()
  @IsString()
  upiId?: string;

  @IsOptional()
  @IsString()
  qrCodeImageUrl?: string;
}
