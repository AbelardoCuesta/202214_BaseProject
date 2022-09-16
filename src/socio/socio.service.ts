import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async findAll(): Promise<SocioEntity[]> {
    return await this.socioRepository.find({
      relations: ['clubes'],
    });
  }

  async findOne(id: string): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
      relations: ['clubes'],
    });
    if (!socio)
      throw new BusinessLogicException(
        'The associate with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return socio;
  }

  async create(socio: SocioEntity): Promise<SocioEntity> {
    if (socio.correo.includes('@')) {
      return await this.socioRepository.save(socio);
    } else {
      throw new BusinessLogicException(
        'The email does not have the character @',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
    const persistedSocio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!persistedSocio)
      throw new BusinessLogicException(
        'The associate with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    socio.id = id;
    if (socio.correo.includes('@')) {
      return await this.socioRepository.save(socio);
    } else {
      throw new BusinessLogicException(
        'The email does not have the character @',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (!socio)
      throw new BusinessLogicException(
        'The associate with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.socioRepository.remove(socio);
  }
}
