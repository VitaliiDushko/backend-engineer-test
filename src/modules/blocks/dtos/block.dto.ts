import { IsNotEmpty, IsPositive } from 'class-validator';
import { TransactionDto } from './transaction.dto';
import { Expose } from 'class-transformer';
import { IsHeightSequential } from '../validation/is-height-sequential.decorator';
import { IsEqualInputOutputSums } from '../validation/is-input-output-sums-equal.decorator';
import { IsBlockIdValid } from '../validation/is-block-id-valid.decorator';

export class BlockDto {
  @Expose()
  @IsNotEmpty()
  @IsBlockIdValid()
  id: string;
  @Expose()
  @IsPositive()
  @IsHeightSequential()
  height: number;
  @IsEqualInputOutputSums()
  transactions: Array<TransactionDto>;
}
