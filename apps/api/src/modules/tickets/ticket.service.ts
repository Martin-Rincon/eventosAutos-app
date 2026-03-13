import { Injectable, Inject } from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  InsufficientCapacityException,
} from '../../common/exceptions/insufficient-capacity.exception';
import {
  DuplicatePurchaseException,
} from '../../common/exceptions/duplicate-purchase.exception';
import { EventNotFoundException } from '../../common/exceptions/event-not-found.exception';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import {
  TicketCodeStrategy,
} from '../../common/strategies/ticket-code.strategy';
import { NanoidTicketCodeStrategy } from '../../common/strategies/nanoid-ticket-code.strategy';

export const TICKET_CODE_STRATEGY = 'TICKET_CODE_STRATEGY';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(TICKET_CODE_STRATEGY)
    private readonly codeStrategy: TicketCodeStrategy,
  ) {}

  /**
   * Purchases a ticket with ACID transaction to prevent double-spend and overcapacity.
   * Uses Serializable isolation for strict consistency.
   */
  async purchaseTicket(userId: string, eventId: string): Promise<Ticket> {
    return this.prisma.$transaction(
      async (tx) => {
        const event = await tx.event.findUnique({
          where: { id: eventId },
          include: { _count: { select: { tickets: true } } },
        });

        if (!event) {
          throw new EventNotFoundException(eventId);
        }

        if (event._count.tickets >= event.capacity) {
          throw new InsufficientCapacityException(eventId);
        }

        const existing = await tx.ticket.findFirst({
          where: {
            userId,
            eventId,
            status: 'CONFIRMED',
          },
        });

        if (existing) {
          throw new DuplicatePurchaseException(userId, eventId);
        }

        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new UserNotFoundException(userId);
        }

        const code = this.codeStrategy.generate();

        return tx.ticket.create({
          data: {
            userId,
            eventId,
            code,
            status: 'CONFIRMED',
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async findByEvent(eventId: string): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      where: { eventId },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async findByUser(userId: string): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: { event: true },
    });
  }

  async findByCode(code: string): Promise<Ticket | null> {
    return this.prisma.ticket.findUnique({
      where: { code },
      include: { event: true, user: { select: { id: true, email: true } } },
    });
  }
}
