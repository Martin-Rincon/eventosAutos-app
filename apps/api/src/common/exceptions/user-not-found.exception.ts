import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userId?: string) {
    super(userId ? `User ${userId} not found` : 'User not found');
  }
}
