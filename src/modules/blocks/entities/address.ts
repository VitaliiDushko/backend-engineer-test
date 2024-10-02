import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { OutputEntity } from './output';

@Entity({ schema: 'main', name: 'address' })
export class AddressEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  height: number;
  @Column({ nullable: false, default: 0 })
  value: number = 0;
  @OneToMany(() => OutputEntity, (output) => output.address)
  outputs: OutputEntity[];
}
