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

@Entity({ schema: 'main', name: 'input' })
export class InputEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Exclude()
  @OneToOne(() => OutputEntity, { nullable: true })
  @JoinColumn() // Ensures this is the owning side of the relationship (foreign key is stored here)
  output: OutputEntity;
  @Column()
  txId: string;
  @Column()
  index: number;
  @Exclude()
  @ManyToOne(() => TransactionEntity, (transaction) => transaction.inputs)
  transaction: TransactionEntity;
}
