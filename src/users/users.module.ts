import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Logger } from 'src/logging/logger';
import { AuthService } from 'src/auth/auth.service';
import { EncryptionService } from './encryption.service';
import { HashingService } from './hashing.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User
      
    ]),
  ],
  exports: [UsersService, TypeOrmModule], //export these two
  controllers: [UsersController],
  providers: [UsersService, Logger, AuthService, EncryptionService,HashingService],
})
export class UsersModule {}
