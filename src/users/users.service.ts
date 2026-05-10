import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { RegisterUserDto } from "src/dto/register-user.dto";
import { UpdateUserDto } from "src/dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.User.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(dto: RegisterUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
