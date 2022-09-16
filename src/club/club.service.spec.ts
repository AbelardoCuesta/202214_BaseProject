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

  it('findAll should return all clubs', async () => {
    const clubes: ClubEntity[] = await service.findAll();
    expect(clubes).not.toBeNull();
    expect(clubes).toHaveLength(clubesList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubesList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre);
    expect(club.descripcion).toEqual(storedClub.descripcion);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubesList[0];
    await service.delete(club.id);

    const deletedClub: ClubEntity = await repository.findOne({
      where: { id: `${club.id}` },
    });
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid cultura', async () => {
    const club: ClubEntity = clubesList[0];
    await service.delete(club.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid country', async () => {
    let club: ClubEntity = clubesList[0];
    club = {
      ...club,
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
    };
    await expect(() => service.update('0', club)).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('update should modify a member', async () => {
    const club: ClubEntity = clubesList[0];
    club.nombre = faker.company.name();
    club.descripcion = faker.lorem.sentence();
    club.imagen = faker.lorem.sentence();
    club.fechaFundacion = faker.date.birthdate();

    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({
      where: { id: `${club.id}` },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre);
    expect(storedClub.descripcion).toEqual(club.descripcion);
  });
});
