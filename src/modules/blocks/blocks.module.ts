import { Module } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from './entities/block';
import { AddressEntity } from './entities/address';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionEntity } from './entities/transaction';
import { InputEntity } from './entities/input';
import { OutputEntity } from './entities/output';
import { IsBlockIdValidValidator } from './validation/is-block-id-valid.validator';
import { IsHeightSequentialValidator } from './validation/is-height-sequential.validator';
import { IsInputOutputSumsEqualValidator } from './validation/is-input-output-sums-equal.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlockEntity,
      AddressEntity,
      TransactionEntity,
      InputEntity,
      OutputEntity,
    ]),
    CacheModule.register(),
  ],
  controllers: [BlocksController],
  providers: [
    IsBlockIdValidValidator,
    IsHeightSequentialValidator,
    IsInputOutputSumsEqualValidator,
    BlocksService,
  ],
})
export class BlocksModule {}
