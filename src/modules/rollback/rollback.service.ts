import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutputEntity } from '../blocks/entities/output';
import { MoreThan, Repository } from 'typeorm';
import { BlockEntity } from '../blocks/entities/block';
import { AddressEntity } from '../blocks/entities/address';
import { TransactionEntity } from '../blocks/entities/transaction';
import { InputEntity } from '../blocks/entities/input';

@Injectable()
export class RollbackService {
  constructor(
    @InjectRepository(BlockEntity)
    private blockRepository: Repository<BlockEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(OutputEntity)
    private outputRepository: Repository<OutputEntity>,
    @InjectRepository(InputEntity)
    private inputRepository: Repository<InputEntity>,
  ) {}

  async rollbackTo(height: number) {
    const blocks = await this.blockRepository.findBy({
      height: MoreThan(height),
    });
    const requiredEnts = blocks.reduce(
      (p, c) => {
        const newOutputs = c.transactions
          .map((t) => {
            const newAddresses = t.outputs
              .map((o) => o.address)
              .filter((a) => !p.addresses.includes(a));
            p.addresses.push(...newAddresses);
            return t.outputs;
          })
          .flat();
        if (newOutputs?.length > 0) {
          p.outputs.push(...newOutputs);
        }
        const newInputs = c.transactions
          .map((t) => {
            const newAddresses = t.inputs
              .map((i) => i.output.address)
              .filter((a) => !p.addresses.includes(a));
            p.addresses.push(...newAddresses);
            return t.inputs.map((i) => i.output);
          })
          .flat();
        if (newInputs?.length > 0) {
          p.inputs.push(...newInputs);
        }
        return p;
      },
      {
        outputs: new Array<OutputEntity>(),
        inputs: new Array<OutputEntity>(),
        addresses: Array<AddressEntity>(),
      },
    );
    for (const address of requiredEnts.addresses) {
      const inputs = requiredEnts.inputs.filter(
        (i) => i.addressId === address.id,
      );
      if (inputs?.length > 0) {
        address.value += inputs.reduce((p, c) => p + c.value, 0);
      }
      const outputs = requiredEnts.outputs.filter(
        (o) => o.addressId === address.id,
      );
      if (outputs?.length > 0) {
        address.value -= outputs.reduce((p, c) => p + c.value, 0);
      }
    }

    await this.addressRepository.save(requiredEnts.addresses);
    await this.addressRepository.update({}, { height: height });
    const transactions = blocks.map((b) => b.transactions).flat();
    await this.inputRepository.remove(transactions.map((t) => t.inputs).flat());
    await this.outputRepository.remove(
      transactions.map((t) => t.outputs).flat(),
    );
    await this.transactionRepository.remove(transactions);
    await this.blockRepository.remove(blocks);
  }
}
