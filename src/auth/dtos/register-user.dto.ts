// src/auth/dtos/register-user.dto.ts
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsEnum,
} from "class-validator";
import { UserRole } from "@prisma/client";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    fullName!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    password!: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber!: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role!: UserRole;
}
