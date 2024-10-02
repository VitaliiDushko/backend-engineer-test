import { IsNotEmpty } from 'class-validator';
import { InputDto } from './input.dto';
import { OutputDto } from './output.dto';
import { Expose } from 'class-transformer';

export class TransactionDto {
  @Expose()
  @IsNotEmpty()
  id: string;
  inputs: Array<InputDto>;
  outputs: Array<OutputDto>;
}
