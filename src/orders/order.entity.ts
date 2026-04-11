import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { OrderStatus, MealSlot, PaymentMethod } from '../common/enums/index';
import { User } from '../users/user.entity';
import { Dish } from '../dishes/dish.entity';
import { Organisation } from '../organisations/organisation.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero_commande: string; // ex: MMS-2025-00421

  // QR Code token unique
  @Column({ unique: true })
  qr_code_token: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  statut: OrderStatus;

  @Column({ type: 'enum', enum: MealSlot })
  creneau: MealSlot;

  @Column({ type: 'date' })
  date_livraison: string;

  // Montants
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant_total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  montant_subvention: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  montant_employe: number; // = total - subvention

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  methode_paiement: PaymentMethod;

  // Points fidélité gagnés
  @Column({ default: 0 })
  points_gagnes: number;

  // Retrait
  @Column({ nullable: true })
  date_recuperation: Date;

  @Column({ nullable: true })
  recupere_par: string; // user_id du distributeur

  // Relations
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'employe_id' })
  employe: User;

  @Column()
  employe_id: string;

  @ManyToOne(() => Organisation, { eager: false })
  @JoinColumn({ name: 'organisation_id' })
  organisation: Organisation;

  @Column()
  organisation_id: string;

  @ManyToMany(() => Dish, { eager: true })
  @JoinTable({ name: 'order_dishes' })
  plats: Dish[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
