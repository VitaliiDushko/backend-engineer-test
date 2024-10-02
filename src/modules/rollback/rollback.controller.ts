import { Controller, Inject, ParseIntPipe, Post, Query } from '@nestjs/common';
import { RollbackService } from './rollback.service';

@Controller('rollback')
export class RollbackController {
  constructor(@Inject(RollbackService) private svc: RollbackService) {}

  @Post()
  async rollbackToHeight(@Query('height', ParseIntPipe) height: number) {
    await this.svc.rollbackTo(height);
  }
}
