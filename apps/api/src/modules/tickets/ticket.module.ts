import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TICKET_CODE_STRATEGY } from './ticket.service';
import { NanoidTicketCodeStrategy } from '../../common/strategies/nanoid-ticket-code.strategy';

@Module({
  controllers: [TicketController],
  providers: [
    TicketService,
    {
      provide: TICKET_CODE_STRATEGY,
      useClass: NanoidTicketCodeStrategy,
    },
  ],
  exports: [TicketService],
})
export class TicketModule {}
