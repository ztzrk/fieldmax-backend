// src/auth/dtos/login-user.dto.ts
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}
