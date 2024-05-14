import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EncryptionService } from './encryption.service';
import { HashingService } from './hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService, //not recommended
    private readonly hashingService: HashingService, //Recommeded since it's a one way, you can't unhash

    
  ) {}

  

  async create(createUserDto: CreateUserDto): Promise<User> { //Implements Hashing -More safe and recommended
    const hashedPassword =await  this.hashingService.hashPassword(
      createUserDto.password,
    );

    // const newUser = this.userRepository.create(createUserDto);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser)
    return {
      ...savedUser,
    };
  }

  async createUsingEncryption(createUserDto: CreateUserDto): Promise<User> { //Implements Encryption
    // Encrypt the username and password
    const encryptedUsername = this.encryptionService.encrypt(createUserDto.username);
    const encryptedPassword = this.encryptionService.encrypt(createUserDto.password);

    // Create a new user with the encrypted data
    const newUser = this.userRepository.create({
      ...createUserDto,
      username: encryptedUsername,
      password: encryptedPassword,
    });

    // Save the new user to the database
    const savedUser = await this.userRepository.save(newUser);

    // Decrypt the username and password
    const decryptedUsername = await this.encryptionService.decrypt(savedUser.username);
    const decryptedPassword = await this.encryptionService.decrypt(savedUser.password);

    // Return the user with decrypted information
    return {
      ...savedUser,
      username: decryptedUsername,
      password: decryptedPassword,
    };
  }

  findUserTransactions(username: string) {
    return `This action returns all transactions specific for ${username}.`;
  }

  findAllTransactions() {
    return `This action returns all transactions in system `;
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    // Decrypt usernames for each user
    const decryptedUsers = await Promise.all(
      users.map(async (user) => {
        const decryptedUsername = await this.encryptionService.decrypt(
          user.username,
        );
        return { ...user, username: decryptedUsername };
      }),
    );

    return decryptedUsers;
  }
}
