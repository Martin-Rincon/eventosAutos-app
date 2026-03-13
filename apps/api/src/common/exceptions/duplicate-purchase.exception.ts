import { ConflictException } from '@nestjs/common';

export class DuplicatePurchaseException extends ConflictException {
  constructor(userId?: string, eventId?: string) {
    super(
      userId && eventId
        ? `User ${userId} already has a ticket for event ${eventId}`
        : 'User already has a ticket for this event',
    );
  }
}
