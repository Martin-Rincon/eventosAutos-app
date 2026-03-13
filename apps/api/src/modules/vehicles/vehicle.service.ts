import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicle.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        photos: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
