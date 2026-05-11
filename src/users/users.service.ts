import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { RegisterUserDto } from "src/dto/register-user.dto";
import { UpdateUserDto } from "src/dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(email: string) {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

async create(dto: RegisterUserDto) {
  return this.prisma.user.create({
    data: {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: dto.password,
    },
  });
}

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
