import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Entity('wallet_transactions')
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  solde_apres: number; // Solde après cette transaction

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  reference: string; // Référence externe (paiement, etc.)

  @ManyToOne(() => Wallet, { eager: false })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column()
  wallet_id: string;

  @CreateDateColumn()
  created_at: Date;
}
