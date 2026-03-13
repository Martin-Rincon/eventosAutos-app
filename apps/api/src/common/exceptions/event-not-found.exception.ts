import { NotFoundException } from '@nestjs/common';

export class EventNotFoundException extends NotFoundException {
  constructor(eventId?: string) {
    super(eventId ? `Event ${eventId} not found` : 'Event not found');
  }
}
