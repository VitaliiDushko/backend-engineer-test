import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceModule } from './modules/balance/balance.module';
import { BlocksModule } from './modules/blocks/blocks.module';
import { RollbackModule } from './modules/rollback/rollback.module';
import { BlockEntity } from './modules/blocks/entities/block';
import { InputEntity } from './modules/blocks/entities/input';
import { OutputEntity } from './modules/blocks/entities/output';
import { AddressEntity } from './modules/blocks/entities/address';
import { TransactionEntity } from './modules/blocks/entities/transaction';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Vitalia1507',
      database: 'backend_engineer_test',
      entities: [
        BlockEntity,
        InputEntity,
        OutputEntity,
        AddressEntity,
        TransactionEntity,
      ],
      synchronize: true,
    }),
    CacheModule.register(),
    BalanceModule,
    BlocksModule,
    RollbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
