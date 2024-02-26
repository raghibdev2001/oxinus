import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class ActiveSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  token!: string;

  @Column({ type: 'text', nullable: false })
  accountId!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date?: string;
}
