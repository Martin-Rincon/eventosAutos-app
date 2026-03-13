import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';

export class PurchaseTicketDto {
  userId: string;
  eventId: string;
}

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('purchase')
  async purchase(@Body() dto: PurchaseTicketDto) {
    return this.ticketService.purchaseTicket(dto.userId, dto.eventId);
  }

  @Get('event/:eventId')
  async findByEvent(@Param('eventId') eventId: string) {
    return this.ticketService.findByEvent(eventId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.ticketService.findByUser(userId);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.ticketService.findByCode(code);
  }
}
