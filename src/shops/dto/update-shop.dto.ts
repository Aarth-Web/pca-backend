import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateShopDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  upiId?: string;

  @IsOptional()
  @IsString()
  qrCodeImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
