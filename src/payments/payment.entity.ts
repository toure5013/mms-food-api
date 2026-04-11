import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../common/enums/index';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reference: string; // Référence unique de la transaction

  @Column({ type: 'enum', enum: PaymentMethod })
  methode: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  statut: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number; // en FCFA

  @Column({ nullable: true })
  telephone: string; // Numéro mobile money

  @Column({ nullable: true })
  provider_transaction_id: string; // ID de transaction du provider (Wave, Orange, etc.)

  @Column({ nullable: true })
  provider_response: string; // Réponse brute du provider (JSON stringifié)

  @Column({ nullable: true })
  error_message: string;

  // Relations
  @ManyToOne(() => Order, { eager: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  order_id: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
