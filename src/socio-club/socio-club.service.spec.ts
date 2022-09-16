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
      imagen: faker.internet.url(),
      fechaFundacion: faker.date.birthdate(),
      descripcion: faker.company.name(),
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
      imagen: faker.internet.url(),
      fechaFundacion: faker.date.birthdate(),
      descripcion: faker.company.name(),
    });

    const result: ClubEntity = await service.addMemberToClub(
      newClub.id,
      newSocio.id,
    );

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(newSocio.nombre);
  });

  it('addArtworkMuseum should thrown exception for an invalid artwork', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      imagen: faker.internet.url(),
      fechaFundacion: faker.date.birthdate(),
      descripcion: faker.company.name(),
    });

    await expect(() =>
      service.addMemberToClub(newClub.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The associate with the given id was not found',
    );
  });

  it('addArtworkMuseum should throw an exception for an invalid museum', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
    });

    await expect(() =>
      service.addMemberToClub('0', newSocio.id),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid artwork', async () => {
    await expect(() =>
      service.findMemberFromClub(club.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The associate with the given id was not found',
    );
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid museum', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() =>
      service.findMemberFromClub('0', socio.id),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an artwork not associated to the museum', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
    });

    await expect(() =>
      service.findMemberFromClub(club.id, newSocio.id),
    ).rejects.toHaveProperty(
      'message',
      'The associate with the given id is not associated to the club',
    );
  });

  it('findArtworkByMuseumIdArtworkId should return artwork by museum', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findMemberFromClub(
      club.id,
      socio.id,
    );
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toBe(socio.nombre);
  });

  it('associateArtworksMuseum should update artworks list for a museum', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
    });

    const updatedClub: ClubEntity = await service.updateMembersFromClub(
      club.id,
      [newSocio],
    );
    expect(updatedClub.socios.length).toBe(1);

    expect(updatedClub.socios[0].nombre).toBe(newSocio.nombre);
    expect(updatedClub.socios[0].correo).toBe(newSocio.correo);
  });

  it('associateArtworksMuseum should throw an exception for an invalid museum', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
    });

    await expect(() =>
      service.updateMembersFromClub('0', [newSocio]),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('deleteArtworkToMuseum should remove an artwork from a museum', async () => {
    const socio: SocioEntity = sociosList[0];

    await service.deleteMemberFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({
      where: { id: club.id },
      relations: ['socios'],
    });
    const deletedSocio: SocioEntity = storedClub.socios.find(
      (a) => a.id === socio.id,
    );

    expect(deletedSocio).toBeUndefined();
  });

  it('deleteArtworkToMuseum should thrown an exception for an invalid artwork', async () => {
    await expect(() =>
      service.deleteMemberFromClub(club.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The associate with the given id was not found',
    );
  });

  it('deleteArtworkToMuseum should thrown an exception for an invalid museum', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() =>
      service.deleteMemberFromClub('0', socio.id),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });
});
