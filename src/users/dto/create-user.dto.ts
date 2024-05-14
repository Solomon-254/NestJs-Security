import { IsEmail, IsString } from "class-validator";

export class CreateUserDto { 
    
    @IsString()
    username: string;
  
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
}


export class SignInDto { 
    
    @IsString()
    username: string;
    
    @IsString()
    password: string;
}