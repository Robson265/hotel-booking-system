import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // These defaults are used by JwtService.sign/verify when you don't override secret.
        // Your AuthService mostly overrides `secret`, but this prevents misconfiguration from crashing.
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: `${config.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN') ?? 15}m`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
