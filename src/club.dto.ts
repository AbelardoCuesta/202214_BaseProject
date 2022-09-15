import { Type } from '@nestjs/common';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ClubDto {
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly imagen: string;

  @IsNotEmpty()
  @IsString()
  readonly fechaFundacion: Date;

  @IsNotEmpty()
  @IsString()
  readonly descripcion: string;

}