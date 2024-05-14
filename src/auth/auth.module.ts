import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { EncryptionService } from 'src/users/encryption.service';
import { HashingService } from 'src/users/hashing.service';


dotenv.config();

@Module({ 
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
  ], //import user module
  controllers: [AuthController],
  providers: [AuthService,  EncryptionService, HashingService,
    {
      provide: APP_GUARD, //module level guard
      useClass: AuthGuard,
    },

  ],
})
export class AuthModule {}
