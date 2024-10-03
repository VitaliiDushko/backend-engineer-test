import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../blocks/entities/address';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
