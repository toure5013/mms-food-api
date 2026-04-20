import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { MealSlot } from '../common/enums/index';
import { Organisation } from '../organisations/organisation.entity';
import { Dish } from '../dishes/dish.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'enum', enum: MealSlot })
  creneau: MealSlot;

  @Column({ default: false })
  is_published: boolean;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  published_at: Date;

  @Column({ nullable: true })
  publication_limite: Date; // deadline avant laquelle on peut publier

  @ManyToOne(() => Organisation, { eager: false })
  @JoinColumn({ name: 'organisation_id' })
  organisation: Organisation;

  @Column()
  organisation_id: string;

  @ManyToMany(() => Dish, { eager: true })
  @JoinTable({ name: 'menu_dishes' })
  plats: Dish[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
