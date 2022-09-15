import { SocioEntity } from '../socio/socio.entity';
import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, JoinTable } from 'typeorm';

@Entity()
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  fechaFundacion: Date;

  @Column()
  imagen: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => SocioEntity, (socios) => socios.clubes)
  @JoinTable()
  socios: SocioEntity[];
}
