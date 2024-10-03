import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OutputEntity } from './output';
import { TransactionEntity } from './transaction';
import { Exclude } from 'class-transformer';

@Entity({ name: 'input' })
export class InputEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Exclude()
  @OneToOne(() => OutputEntity, { nullable: true, eager: true })
  @JoinColumn()
  output: OutputEntity;
  @Column()
  txId: string;
  @Column()
  index: number;
  @Column()
  @JoinColumn() // Ensures this is the owning side of the relationship (foreign key is stored here)
  transactionId: string;
  @Exclude()
  @ManyToOne(() => TransactionEntity, (transaction) => transaction.inputs)
  transaction: TransactionEntity;
}
