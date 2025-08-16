// src/users/users.service.ts
import { User, Prisma } from "@prisma/client";
import { UpdateUserDto } from "./dtos/user.dto";
import { RegisterUserDto } from "../auth/dtos/register-user.dto";
import prisma from "../db";
import * as bcrypt from "bcryptjs";

function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
): Omit<User, Key> {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}

export class UserService {
    public async findAllUsers(query: { search?: string }) {
        const { search } = query;

        const whereCondition: Prisma.UserWhereInput = search
            ? {
                  OR: [
                      { fullName: { contains: search, mode: "insensitive" } },
                      { email: { contains: search, mode: "insensitive" } },
                  ],
              }
            : {};

        const users = await prisma.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return users;
    }

    public async findUserById(
        userId: string
    ): Promise<Omit<User, "password"> | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error("User not found");
        return exclude(user, ["password"]);
    }

    public async updateUser(
        userId: string,
        userData: UpdateUserDto
    ): Promise<Omit<User, "password">> {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { ...userData },
        });
        return exclude(updatedUser, ["password"]);
    }

    public async deleteUser(userId: string): Promise<Omit<User, "password">> {
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });
        return exclude(deletedUser, ["password"]);
    }

    public async createUser(
        userData: RegisterUserDto
    ): Promise<Omit<User, "password">> {
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

        return exclude(createdUser, ["password"]);
    }
    public async deleteMultipleUsers(userIds: string[]): Promise<void> {
        await prisma.user.deleteMany({
            where: {
                id: {
                    in: userIds,
                },
            },
        });
    }
}
