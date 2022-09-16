import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
  ) {}

  async findAll(): Promise<ClubEntity[]> {
    return await this.clubRepository.find({
      relations: ['socios'],
    });
  }

  async findOne(id: string): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id },
      relations: ['socios'],
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return club;
  }

  async create(club: ClubEntity): Promise<ClubEntity> {
    if (club.descripcion.length <= 100) {
      return await this.clubRepository.save(club);
    } else {
      throw new BusinessLogicException(
        'The description length is greater than 100',
        BusinessError.NOT_FOUND,
      );
    }
  }

  async update(id: string, club: ClubEntity): Promise<ClubEntity> {
    const persistedClub: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!persistedClub)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    club.id = id;

    return await this.clubRepository.save(club);
  }

  async delete(id: string) {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!club)
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.clubRepository.remove(club);
  }
}
