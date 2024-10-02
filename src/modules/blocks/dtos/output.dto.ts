import { Expose } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class OutputDto {
  @Expose()
  @IsNotEmpty()
  address: string;
  @Expose()
  @IsPositive()
  value: number;
}
