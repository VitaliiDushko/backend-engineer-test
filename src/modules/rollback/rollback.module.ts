import { Module } from '@nestjs/common';
import { RollbackService } from './rollback.service';
import { RollbackController } from './rollback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from '../blocks/entities/block';
import { AddressEntity } from '../blocks/entities/address';
import { TransactionEntity } from '../blocks/entities/transaction';
import { OutputEntity } from '../blocks/entities/output';
import { InputEntity } from '../blocks/entities/input';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlockEntity,
      AddressEntity,
      TransactionEntity,
      OutputEntity,
      InputEntity,
    ]),
  ],
  providers: [RollbackService],
  controllers: [RollbackController],
})
export class RollbackModule {}
