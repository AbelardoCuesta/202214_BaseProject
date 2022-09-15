import { Type } from '@nestjs/common';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class SocioDto {
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  correo: string;

  @IsNotEmpty()
  @IsString()
  fechaNacimiento: Date;

}