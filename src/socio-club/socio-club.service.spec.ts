import { Test, TestingModule } from '@nestjs/testing';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SocioClubService } from './socio-club.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SocioClubService', () => {
  let service: SocioClubService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioClubService],
    }).compile();

    service = module.get<SocioClubService>(SocioClubService);
    clubRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    socioRepository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();

    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombre: faker.internet.userName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.birthdate(),
      });
      sociosList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.company.name(),
      imagen: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      descripcion: faker.lorem.sentence(),
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addArtworkMuseum should add an artwork to a museum', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      imagen: faker.lorem.sentence(),
      fechaFundacion: faker.date.birthdate(),
      descripcion: faker.lorem.sentence(),
    });

    const result: ClubEntity = await service.addMemberToClub(
      newClub.id,
      newSocio.id,
    );

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(newSocio.nombre);
  });

});
