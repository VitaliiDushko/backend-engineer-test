import { Module } from '@nestjs/common';
import { RollbackService } from './rollback.service';
import { RollbackController } from './rollback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from '../blocks/entities/block';
import { AddressEntity } from '../blocks/entities/address';

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity, AddressEntity])],
  providers: [RollbackService],
  controllers: [RollbackController]
})
export class RollbackModule {}
