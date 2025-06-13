// src/auth/auth.service.ts
import { PrismaClient, User, UserRole } from "@prisma/client";
import { RegisterUserDto } from "./dtos/register-user.dto";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { LoginUserDto } from "./dtos/login-user.dto";

export interface DataStoredInToken {
    id: string;
    role: UserRole;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export class AuthService {
    private prisma = new PrismaClient();

    public async register(
        userData: RegisterUserDto
    ): Promise<Omit<User, "password">> {
        const findUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (userData.role === "ADMIN") {
            throw new Error(
                "Admin role cannot be registered through this public endpoint."
            );
        }

        if (findUser) {
            throw new Error(`This email ${userData.email} already exists.`);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const createdUser = await this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            },
        });

        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
    }
    public async login(
        userData: LoginUserDto
    ): Promise<{ tokenData: TokenData; user: Omit<User, "password"> }> {
        const findUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (!findUser) {
            throw new Error(`This email ${userData.email} was not found.`);
        }

        const isPasswordMatching: boolean = await bcrypt.compare(
            userData.password,
            findUser.password
        );
        if (!isPasswordMatching) {
            throw new Error("Password not matching");
        }

        const tokenData = this.createToken(findUser);
        const { password, ...userWithoutPassword } = findUser;

        return { tokenData, user: userWithoutPassword };
    }

    private createToken(user: User): TokenData {
        const dataStoredInToken: DataStoredInToken = {
            id: user.id,
            role: user.role,
        };
        const secretKey: string = process.env.JWT_SECRET || "supersecret";
        const expiresIn: number = 60 * 60 * 24; // 24 jam

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }),
        };
    }
}
