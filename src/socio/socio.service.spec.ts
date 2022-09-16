import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        nombre: faker.internet.userName(),
        correo: faker.internet.email(),
        fechaNacimiento: faker.date.birthdate(),
      });
      sociosList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new cultura', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
      clubes: [],
    };

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: `${newSocio.id}` },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(newSocio.nombre);
    expect(storedSocio.correo).toEqual(newSocio.correo);
  });

  it('findAll should return all members', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombre).toEqual(storedSocio.nombre);
    expect(socio.correo).toEqual(storedSocio.correo);
  });

  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The associate with the given id was not found',
    );
  });

  it('delete should remove a member', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);

    const deletedSocio: SocioEntity = await repository.findOne({
      where: { id: `${socio.id}` },
    });
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid cultura', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The associate with the given id was not found',
    );
  });

  it('update should throw an exception for an invalid country', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio,
      nombre: faker.internet.userName(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.birthdate(),
    };
    await expect(() => service.update('0', socio)).rejects.toHaveProperty(
      'message',
      'The associate with the given id was not found',
    );
  });

  it('update should modify a member', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.nombre = faker.internet.userName();
    socio.correo = faker.internet.email();
    socio.fechaNacimiento = faker.date.birthdate();

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: `${socio.id}` },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(socio.nombre);
    expect(storedSocio.correo).toEqual(socio.correo);
  });
});
