import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account')
export default class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  firstname!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  lastname!: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", length: 16, nullable: false })
  phone!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  password!: string;

  @Column({ type: 'date' })
  birthday?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  last_modified?: Date;
}
