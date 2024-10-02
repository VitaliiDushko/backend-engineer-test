import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockEntity } from './entities/block';
import { TransactionEntity } from './entities/transaction';
import { OutputEntity } from './entities/output';
import { InputEntity } from './entities/input';
import { AddressEntity } from './entities/address';
import { BlockDto } from './dtos/block.dto';
import { In, Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PREVIOUS_OUTPUTS } from './constants/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(BlockEntity)
    private blockRepository: Repository<BlockEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async saveBlock(blockDto: BlockDto) {
    //block
    const blockEntity = plainToClass(BlockEntity, blockDto);
    //transactions
    blockEntity.transactions = [] as Array<TransactionEntity>;
    const transactions = blockDto.transactions;
    //addresses
    const addresses: Array<AddressEntity> = [];
    const previousOutputs = (await this.cacheManager.get(
      PREVIOUS_OUTPUTS + blockDto.height,
    )) as OutputEntity[];

    const addressesIds = transactions
      .map((t) => {
        const transEnt = plainToClass(TransactionEntity, t);
        transEnt.block = blockEntity;
        const outputs = plainToInstance(OutputEntity, t.outputs);
        outputs.forEach((o, i) => {
          o.transaction = transEnt;
          o.index = i;
        });
        for (const input of t.inputs) {
          const inputEnt = plainToClass(InputEntity, input);
          inputEnt.transaction = transEnt;
          inputEnt.output = previousOutputs.find(
            (oe) => oe.transactionId === input.txId && oe.index === input.index,
          );
          transEnt.inputs.push(inputEnt);
        }
        blockEntity.transactions.push(transEnt);
        return t.outputs;
      })
      .flat()
      .map((o) => o.address);
    const existingAddresses = await this.addressRepository.findBy({
      id: In(addressesIds),
    });
    if (existingAddresses?.length > 0) {
      addresses.push(...existingAddresses);
    }
    const newAddressses = addressesIds
      .filter((id) => !addresses.some((a) => a.id === id))
      .map((id) => ({ id, height: blockDto.height }) as AddressEntity);
    if (newAddressses.length > 0) {
      addresses.push(...newAddressses);
    }

    blockEntity.transactions.forEach((t) => {
      if (t.inputs?.length > 0) {
        t.inputs.forEach((i) => {
          addresses.find((a) => a.id === i.output.addressId).value -=
            i.output.value;
        });
      }
      t.outputs.forEach((o) => {
        o.address = addresses.find((a) => a.id === o.addressId);
        o.address.value += o.value;
      });
    });
    await this.blockRepository.save(blockEntity);
  }
}
