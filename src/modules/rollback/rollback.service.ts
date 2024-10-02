import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutputEntity } from '../blocks/entities/output';
import { MoreThan, Repository } from 'typeorm';
import { BlockEntity } from '../blocks/entities/block';
import { AddressEntity } from '../blocks/entities/address';

@Injectable()
export class RollbackService {
  constructor(
    @InjectRepository(BlockEntity)
    private blockRepository: Repository<BlockEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
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
      address.value -= requiredEnts.inputs.find(
        (i) => i.addressId === address.id,
      ).value;
      address.value += requiredEnts.outputs.find(
        (o) => o.addressId === address.id,
      ).value;
    }
    await this.addressRepository.update({}, { height: height });
    await this.blockRepository.remove(blocks);
  }
}
