import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { OutputEntity } from '../entities/output';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DataSource, In, Repository } from 'typeorm';
import { BlockDto } from '../dtos/block.dto';
import { PREVIOUS_OUTPUTS } from '../constants/constants';
import { TransactionDto } from '../dtos/transaction.dto';
import { getInstance } from '../../../main';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsInputOutputSumsEqualValidator
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(OutputEntity)
    private outputRepository: Repository<OutputEntity>,
  ) {}

  async validate(
    value: Array<TransactionDto>,
    validationArguments: ValidationArguments,
  ) {
    if (!this.cacheManager) {
      this.cacheManager = await getInstance().get<Cache>(CACHE_MANAGER);
    }
    if (!this.outputRepository) {
      const dataSource = await getInstance().get(DataSource);
      this.outputRepository = dataSource.getRepository(OutputEntity);
    }
    let valid = true;
    const inputs = value.map((t) => t.inputs).flat();
    if (inputs?.length > 0) {
      const outputs = value.map((t) => t.outputs).flat();
      const outputSearchObjs: Array<{
        transactionId: string;
        indexes: number[];
      }> = [];

      for (const input of inputs) {
        let so = outputSearchObjs.find((so) => so.transactionId === input.txId);
        if (!so) {
          so = { transactionId: input.txId, indexes: [] };
          outputSearchObjs.push(so);
        }
        so.indexes.push(input.index);
      }

      const previousOutputs = (
        await Promise.all(
          outputSearchObjs.map((so) =>
            this.outputRepository.findBy({
              transactionId: so.transactionId,
              index: In(so.indexes),
            }),
          ),
        )
      ).flat();

      await this.cacheManager.set(
        PREVIOUS_OUTPUTS + (validationArguments.object as BlockDto).height,
        previousOutputs,
        0,
      );

      valid =
        previousOutputs.reduce((p, c) => p + c.value, 0) ===
        outputs.reduce((p, c) => p + c.value, 0);
    }

    return valid;
  }

  defaultMessage() {
    return `Sum of the values of the inputs is NOT exactly equal to the sum of the values of the outputs`;
  }
}
