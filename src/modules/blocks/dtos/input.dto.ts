import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class InputDto {
  @Expose()
  @IsNotEmpty()
  txId: string;
  @Expose()
  @IsPositive()
  index: number;
}
