import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { DishCategory } from '../common/enums/index';
import { Organisation } from '../organisations/organisation.entity';

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column({ type: 'enum', enum: DishCategory, nullable: true })
  categorie: DishCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prix: number; // en FCFA

  // Attributs nutritionnels / spéciaux
  @Column({ default: false }) sans_sel: boolean;
  @Column({ default: false }) sans_gras: boolean;
  @Column({ default: false }) sans_sucre: boolean;
  @Column({ default: false }) sans_huile: boolean;
  @Column({ default: false }) vegetarien: boolean;
  @Column({ default: false }) halal: boolean;

  @Column({ type: 'simple-array', nullable: true })
  allergenes: string[];

  @Column({ nullable: true })
  organisation_id: string;

  @ManyToOne(() => Organisation, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organisation_id' })
  organisation: Organisation;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
