import { User } from "@prisma/client";
import { RegisterUserDto } from "./dtos/register-user.dto";
import * as bcrypt from "bcryptjs";
import { LoginUserDto } from "./dtos/login-user.dto";
import { randomBytes } from "crypto";
import prisma from "../db";

export class AuthService {
    public async register(
        userData: RegisterUserDto
    ): Promise<Omit<User, "password">> {
        if (userData.role === "ADMIN") {
            throw new Error(
                "Admin role cannot be registered through this public endpoint."
            );
        }

        const findUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (findUser) {
            throw new Error(`This email ${userData.email} already exists.`);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const createdUser = await prisma.user.create({
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
    ): Promise<{ sessionId: string; user: Omit<User, "password"> }> {
        const findUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (!findUser) {
            throw new Error(`This email ${userData.email} was not found.`);
        }

        const isPasswordMatching = await bcrypt.compare(
            userData.password,
            findUser.password
        );
        if (!isPasswordMatching) {
            throw new Error("Password not matching");
        }

        const sessionId = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.session.create({
            data: {
                id: sessionId,
                userId: findUser.id,
                expiresAt: expiresAt,
            },
        });

        const { password, ...userWithoutPassword } = findUser;
        return { sessionId, user: userWithoutPassword };
    }

    public async logout(sessionId: string): Promise<void> {
        await prisma.session
            .delete({
                where: { id: sessionId },
            })
            .catch(() => {});
    }
}
