import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubesList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubesList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await repository.save({
        nombre: faker.company.name(),
        imagen: faker.lorem.sentence(),
        fechaFundacion: faker.date.birthdate(),
        descripcion: faker.lorem.sentence(),
      });
      clubesList.push(club);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new cultura', async () => {
    const club: ClubEntity = {
      id: '',
      nombre: faker.company.name(),
      imagen: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      descripcion: faker.lorem.sentence(),
      socios: [],
    };

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({
      where: { id: `${newClub.id}` },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre);
    expect(storedClub.descripcion).toEqual(newClub.descripcion);
    expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion);
    expect(storedClub.imagen).toEqual(newClub.imagen);
  });
});
