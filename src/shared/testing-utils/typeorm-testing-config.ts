import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from '../../socio/socio.entity';
import { ClubEntity } from '../../club/club.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [ClubEntity, SocioEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([ClubEntity, SocioEntity]),
];