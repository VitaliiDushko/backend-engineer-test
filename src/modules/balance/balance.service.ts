import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from '../blocks/entities/address';
import { Repository } from 'typeorm';
import { BalanceDto } from './dto/balance.dto';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async getBalanceForTheAddress(addressId: string) {
    const address = await this.addressRepository.findOneBy({ id: addressId });
    return plainToInstance(BalanceDto, address, { 
      excludeExtraneousValues: true  // Ensure only exposed properties are included
    });
  }
}
