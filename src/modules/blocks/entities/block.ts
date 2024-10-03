import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TransactionEntity } from './transaction';
import { Exclude } from 'class-transformer';

@Entity({ schema: 'main', name: 'block' })
export class BlockEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  height: number;
  @Exclude()
  @OneToMany(() => TransactionEntity, (transaction) => transaction.block, {
    cascade: true, // Cascade save operations to related address
    eager: true,
  })
  transactions: TransactionEntity[];
  @Exclude()
  @Column({ nullable: false, default: true })
  current: boolean;
}
