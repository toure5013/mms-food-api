import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum LoyaltyTransactionType {
  EARNED = 'EARNED',     // Points gagnés via commande
  REDEEMED = 'REDEEMED', // Points utilisés
  EXPIRED = 'EXPIRED',   // Points expirés
  BONUS = 'BONUS',       // Points bonus (promo, etc.)
}

@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LoyaltyTransactionType })
  type: LoyaltyTransactionType;

  @Column()
  points: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  reference: string; // order_id ou promo_id

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;
}
