import { Controller, Get, Inject, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(@Inject(BalanceService) private svc: BalanceService) {}

  @Get(':address')
  async getAddressBalance(@Param('address') address: string) {
    return await this.svc.getBalanceForTheAddress(address);
  }
}
