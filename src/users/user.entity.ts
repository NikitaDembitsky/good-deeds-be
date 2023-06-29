import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import {GoodDeed} from '../good-deeds/good-deed.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ nullable: true, unique: true })
  tag: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @ManyToMany(() => User, {onDelete: 'CASCADE'})
  @JoinTable()
  friends: User[];

  @OneToMany(() => GoodDeed, (goodDeed) => goodDeed.user, { onDelete: 'CASCADE' })
  goodDeeds: GoodDeed[];
}
