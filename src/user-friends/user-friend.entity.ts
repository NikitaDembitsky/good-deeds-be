import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from '../users/user.entity';

@Entity()
export class UserFriends {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  friendId: number

  @ManyToOne(() => User, (user) => user.friends, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.friends, { onDelete: 'CASCADE' })
  friend: User;
}
