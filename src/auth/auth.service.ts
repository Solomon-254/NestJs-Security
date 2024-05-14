import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from 'src/users/encryption.service';
import { HashingService } from 'src/users/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
     //it is recommended to use hashing rather than encryption in password security
     private readonly hashingService: HashingService,


  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByUsername(username);
    // const decryptedPassword = await this.encryptionService.decrypt(user?.password)
    const isCorrectPassword = await this.hashingService.comparePasswords(pass, user?.password);
    console.log('Password', isCorrectPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role, // Include the user's role in the JWT payload
      // claims: user.claims, // Include the user's claims in the JWT payload
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
