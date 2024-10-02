import { Body, Controller, Inject, Post } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlockDto } from './dtos/block.dto';

@Controller('/blocks')
export class BlocksController {
  constructor(@Inject(BlocksService) private svc: BlocksService) {}

  @Post()
  async updateAddressBalances(@Body() blockDto: BlockDto) {
    await this.svc.saveBlock(blockDto);
  }
}
