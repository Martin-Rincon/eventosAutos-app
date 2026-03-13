import { BadRequestException } from '@nestjs/common';

export class InsufficientCapacityException extends BadRequestException {
  constructor(eventId?: string) {
    super(
      eventId
        ? `Event ${eventId} has reached maximum capacity`
        : 'Event has reached maximum capacity',
    );
  }
}
