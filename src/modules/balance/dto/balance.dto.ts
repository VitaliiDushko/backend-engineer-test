import { Expose, Transform } from 'class-transformer';

export class BalanceDto {
  @Expose()
  @Transform(({ obj }) => obj.id)
  address: string;
  @Expose()
  @Transform(({ obj }) => obj.value)
  balance: number;
}
