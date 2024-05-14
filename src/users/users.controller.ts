import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SignInDto } from './dto/create-user.dto';
import { Logger } from 'src/logging/logger';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private authService: AuthService,
  ) {}
  @Public()
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return { message: 'User created successfully', createdUser: newUser };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }
  }
 
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto): Promise<{ token: string }> {
    try {
      // Attempt sign-in
      const { access_token } = await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      );
      // Log successful sign-in
      console.log(`User ${signInDto.username} signed in successfully.`);
      return { token: access_token };
    } catch (error) {
      console.error(`Sign-in failed: ${error.message}`);
      // Throw an UnauthorizedException when username or password is invalid
      throw new HttpException(
        'Invalid username or password.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Roles('user', 'admin')
  @Get('my-transactions') //all users can access 
  findUserTransactions(@Request() req) {
    console.log('Passed claims Based Auth')
    return this.usersService.findUserTransactions(req.user.username);
  }


  @Roles('admin')
  @Get('all-transactions') //only admins can access
  findAllTransaction() {
    return this.usersService.findAllTransactions();
  }

  @Roles('admin')
  @Delete('transactions')
  async deleteAllTransactions(): Promise<{ message: string }> {
    try {
      // Perform the deletion operation here
      return { message: 'All transactions deleted successfully' };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to delete transactions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  @Roles('admin')
  @Get('all-users') //only admins can access
  getAllUsers() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   try {
  //     const user = await this.usersService.findOne(+id);
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }
  //     return { message: 'User found successfully', user };
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
