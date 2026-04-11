import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn,
} from 'typeorm';
import { UserRole } from '../common/enums/index';
import { Organisation } from '../organisations/organisation.entity';
import { Wallet } from '../wallet/wallet.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prenom: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password_hash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  service: string; // département dans l'entreprise

  // OTP (email uniquement)
  @Column({ nullable: true, select: false })
  otp_code: string;

  @Column({ nullable: true, select: false })
  otp_expires_at: Date;

  // Fidélité
  @Column({ default: 0 })
  loyalty_points: number;

  @Column({ nullable: true })
  loyalty_expires_at: Date;

  // Push notifications
  @Column({ nullable: true })
  fcm_token: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_first_login: boolean; // premier login → doit créer mot de passe

  // Multi-tenant: null pour SUPER_ADMIN et ADMIN_MMS
  @ManyToOne(() => Organisation, (org) => org.users, { nullable: true, eager: false })
  @JoinColumn({ name: 'organisation_id' })
  organisation: Organisation;

  @Column({ nullable: true })
  organisation_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;
}
