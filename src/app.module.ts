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
      host: 'db',
      port: +process.env.POSTGRES_DB_PORT || 5432,
      username: process.env.POSTGRES_USER || 'vitaliidushko',
      password: process.env.POSTGRES_PASSWORD || 'Vitalia1507',
      database: process.env.POSTGRES_DB || 'engineer_test_db',
      synchronize: true, // Enable this for automatic schema sync (development only)
      retryAttempts: 50, // Number of retry attempts if connection fails
      retryDelay: 3000, // Delay between retries (in milliseconds)
      // Enable verbose logging
      logging: ['query', 'error', 'schema', 'warn', 'info', 'log'],
      entities: [
        BlockEntity,
        InputEntity,
        OutputEntity,
        AddressEntity,
        TransactionEntity,
      ],
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
