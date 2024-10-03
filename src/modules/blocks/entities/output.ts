import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressEntity } from './address';
import { TransactionEntity } from './transaction';
import { Exclude, Expose, Transform } from 'class-transformer';

@Entity({ schema: 'main', name: 'output' })
export class OutputEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  @JoinColumn()
  @Transform(({ obj }) => obj.address)
  @Expose()
  addressId: string;
  @Exclude()
  @ManyToOne(() => AddressEntity, (address) => address.outputs, {
    cascade: true, // Cascade save operations to related address
    eager: true,
  })
  address: AddressEntity;
  @Expose()
  @Column({ nullable: false })
  value: number;
  @Exclude()
  @Column({ nullable: false })
  index: number;
  @Column()
  @JoinColumn()
  transactionId: string;
  @Exclude()
  @ManyToOne(() => TransactionEntity, (transaction) => transaction.outputs)
  transaction: TransactionEntity;
}
