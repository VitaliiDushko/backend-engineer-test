import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { InputEntity } from './input';
import { OutputEntity } from './output';
import { BlockEntity } from './block';
import { Exclude } from 'class-transformer';

@Entity({ name: 'transaction' })
export class TransactionEntity {
  @PrimaryColumn()
  id: string;
  @Exclude()
  @ManyToOne(() => BlockEntity, (block) => block.transactions)
  block: BlockEntity;
  @Exclude()
  @OneToMany(() => InputEntity, (input) => input.transaction, {
    cascade: true, // Cascade save operations to related address
    eager: true,
  })
  inputs: InputEntity[];
  @Exclude()
  @OneToMany(() => OutputEntity, (output) => output.transaction, {
    cascade: true, // Cascade save operations to related address
    eager: true,
  })
  outputs: OutputEntity[];
}
