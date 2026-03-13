import { Test, TestingModule } from '@nestjs/testing';
import { TicketService, TICKET_CODE_STRATEGY } from './ticket.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InsufficientCapacityException } from '../../common/exceptions/insufficient-capacity.exception';
import { DuplicatePurchaseException } from '../../common/exceptions/duplicate-purchase.exception';
import { EventNotFoundException } from '../../common/exceptions/event-not-found.exception';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { TicketCodeStrategy } from '../../common/strategies/ticket-code.strategy';

describe('TicketService', () => {
  let service: TicketService;
  let prisma: jest.Mocked<PrismaService>;
  let codeStrategy: jest.Mocked<TicketCodeStrategy>;

  const mockUserId = 'user-1';
  const mockEventId = 'event-1';
  const mockTicketCode = 'ABC123XYZ789';

  const mockEvent = {
    id: mockEventId,
    name: 'Track Day',
    capacity: 100,
    _count: { tickets: 50 },
  };

  const mockUser = {
    id: mockUserId,
    email: 'user@test.com',
  };

  const mockTicket = {
    id: 'ticket-1',
    userId: mockUserId,
    eventId: mockEventId,
    code: mockTicketCode,
    status: 'CONFIRMED' as const,
  };

  const mockTx = {
    event: {
      findUnique: jest.fn(),
    },
    ticket: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const mockCodeStrategy: TicketCodeStrategy = {
      generate: jest.fn().mockReturnValue(mockTicketCode),
    };

    const mockPrismaService = {
      $transaction: jest.fn(),
      ticket: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    mockPrismaService.$transaction.mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) =>
      cb(mockTx),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: TICKET_CODE_STRATEGY,
          useValue: mockCodeStrategy,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    prisma = module.get(PrismaService);
    codeStrategy = module.get(TICKET_CODE_STRATEGY);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('purchaseTicket', () => {
    it('should successfully purchase a ticket when capacity is available', async () => {
      mockTx.event.findUnique.mockResolvedValue(mockEvent);
      mockTx.ticket.findFirst.mockResolvedValue(null);
      mockTx.user.findUnique.mockResolvedValue(mockUser);
      mockTx.ticket.create.mockResolvedValue(mockTicket);

      const result = await service.purchaseTicket(mockUserId, mockEventId);

      expect(result).toEqual(mockTicket);
      expect(result.code).toBe(mockTicketCode);
      expect(mockTx.event.findUnique).toHaveBeenCalledWith({
        where: { id: mockEventId },
        include: { _count: { select: { tickets: true } } },
      });
      expect(mockTx.ticket.findFirst).toHaveBeenCalledWith({
        where: { userId: mockUserId, eventId: mockEventId, status: 'CONFIRMED' },
      });
      expect(codeStrategy.generate).toHaveBeenCalled();
      expect(mockTx.ticket.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          eventId: mockEventId,
          code: mockTicketCode,
          status: 'CONFIRMED',
        },
      });
    });

    it('should throw InsufficientCapacityException when event is at capacity', async () => {
      const fullEvent = {
        ...mockEvent,
        _count: { tickets: mockEvent.capacity },
      };
      mockTx.event.findUnique.mockResolvedValue(fullEvent);

      await expect(service.purchaseTicket(mockUserId, mockEventId)).rejects.toThrow(
        InsufficientCapacityException,
      );

      expect(mockTx.ticket.findFirst).not.toHaveBeenCalled();
      expect(mockTx.ticket.create).not.toHaveBeenCalled();
    });

    it('should throw DuplicatePurchaseException when user already has a ticket', async () => {
      mockTx.event.findUnique.mockResolvedValue(mockEvent);
      mockTx.ticket.findFirst.mockResolvedValue(mockTicket);

      await expect(service.purchaseTicket(mockUserId, mockEventId)).rejects.toThrow(
        DuplicatePurchaseException,
      );

      expect(mockTx.ticket.create).not.toHaveBeenCalled();
    });

    it('should throw EventNotFoundException when event does not exist', async () => {
      mockTx.event.findUnique.mockResolvedValue(null);

      await expect(service.purchaseTicket(mockUserId, mockEventId)).rejects.toThrow(
        EventNotFoundException,
      );

      expect(mockTx.ticket.findFirst).not.toHaveBeenCalled();
      expect(mockTx.ticket.create).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      mockTx.event.findUnique.mockResolvedValue(mockEvent);
      mockTx.ticket.findFirst.mockResolvedValue(null);
      mockTx.user.findUnique.mockResolvedValue(null);

      await expect(service.purchaseTicket(mockUserId, mockEventId)).rejects.toThrow(
        UserNotFoundException,
      );

      expect(mockTx.ticket.create).not.toHaveBeenCalled();
    });
  });
});
