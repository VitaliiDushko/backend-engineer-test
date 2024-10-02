// eslint-disable-next-line prettier/prettier

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CURRENT_HIGHT_CACHE } from '../constants/constants';
import { Repository } from 'typeorm';
import { BlockEntity } from '../entities/block';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getInstance } from 'src/main';
import { DataSource } from 'typeorm';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsHeightSequentialValidator
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(BlockEntity) private blockRepository: Repository<BlockEntity>,
  ) {}

  async validate(value: number) {
    // Fetch data from the cache
    this.cacheManager = await getInstance().resolve(CACHE_MANAGER);
    const dataSource = await getInstance().get(DataSource);
    this.blockRepository = dataSource.getRepository(BlockEntity);
    let cachedValue = await this.cacheManager.get<number>(CURRENT_HIGHT_CACHE);
    if (typeof cachedValue === 'undefined') {
      cachedValue = (await this.blockRepository.findOneBy({ current: true }))
        ?.height;
    }
    return value - (cachedValue ?? 0) === 1 ? true : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Height ${args.value} is not valid because it is not bigger for one height than the previous`;
  }
}
