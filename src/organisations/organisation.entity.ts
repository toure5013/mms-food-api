import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { MenuMode, SubventionType } from '../common/enums/index';
import { User } from '../users/user.entity';

@Entity('organisations')
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string; // identifiant URL unique ex: "bmce-bank"

  @Column()
  nom: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ default: '#E87722' }) // couleur MMS orange par défaut
  couleur_primaire: string;

  @Column({ default: '#1A1A2E' })
  couleur_secondaire: string;

  @Column({ type: 'enum', enum: MenuMode, default: MenuMode.MMS })
  mode_gestion_menu: MenuMode;

  @Column({ type: 'enum', enum: SubventionType, default: SubventionType.FIXED })
  subvention_type: SubventionType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subvention_valeur: number; // FCFA ou %

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subvention_plafond_mensuel: number; // si type CAPPED ou HYBRID

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => User, (user) => user.organisation)
  users: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
