// eslint-disable-next-line prettier/prettier

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlockDto } from '../dtos/block.dto';
import { SHA256 } from 'bun';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBlockIdValidValidator implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments?: ValidationArguments) {
    const blockDto = validationArguments.object as BlockDto;
    // Create a new SHA256 hash instance
    const testHash = new SHA256();

    // Update the hash with data (in this case, a string)
    testHash.update(
      blockDto.height + blockDto.transactions.reduce((p, c) => p + c.id, ''),
    );

    const testDigest = testHash.digest('hex');

    const idHash = new SHA256();

    idHash.update(value);

    const idDigest = idHash.digest('hex');

    return testDigest === idDigest;
  }

  defaultMessage(validationArguments?: ValidationArguments) {
    return `The Block id ${validationArguments.value} is not valid`;
  }
}
