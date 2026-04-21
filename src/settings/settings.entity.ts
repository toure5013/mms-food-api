import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true })
  general: any;

  @Column({ type: 'jsonb', nullable: true })
  branding: any;

  @Column({ type: 'jsonb', nullable: true })
  notifs: any;

  @Column({ type: 'jsonb', nullable: true })
  security: any;

  @Column({ type: 'jsonb', nullable: true })
  org: any;

  @Column({ type: 'jsonb', nullable: true })
  dietary: { 
    customAllergies: string[], 
    customRegimes: string[] 
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}