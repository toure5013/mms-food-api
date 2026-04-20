import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { MenuMode, SubventionType, DishCategory, FinancialMode } from '../common/enums/index';
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

  @Column({ type: 'enum', enum: FinancialMode, default: FinancialMode.DEBT })
  financial_mode: FinancialMode;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subvention_valeur: number; // FCFA ou %

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subvention_plafond_mensuel: number; // si type CAPPED ou HYBRID

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prix_min_plats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prix_max_plats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prix_max_menu: number;

  @Column({ type: 'simple-array', nullable: true })
  composition_menu: DishCategory[];

  @OneToMany(() => User, (user) => user.organisation)
  users: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
