
import { ClubEntity } from '../club/club.entity';
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from 'typeorm';

@Entity()
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  fechaNacimiento: Date;

  @ManyToMany(() => ClubEntity, (clubes) => clubes.socios)
  clubes: ClubEntity[];

}
