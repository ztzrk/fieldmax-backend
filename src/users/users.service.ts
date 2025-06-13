// src/users/users.service.ts
import { PrismaClient, User } from "@prisma/client";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { RegisterUserDto } from "../auth/dtos/register-user.dto";
import * as bcrypt from "bcryptjs";

// Helper function to exclude keys from an object
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
    private prisma = new PrismaClient();

    public async findAllUsers(): Promise<Omit<User, "password">[]> {
        const users = await this.prisma.user.findMany();
        return users.map((user) => exclude(user, ["password"]));
    }

    public async findUserById(
        userId: string
    ): Promise<Omit<User, "password"> | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new Error("User not found");
        return exclude(user, ["password"]);
    }

    public async updateUser(
        userId: string,
        userData: UpdateUserDto
    ): Promise<Omit<User, "password">> {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { ...userData },
        });
        return exclude(updatedUser, ["password"]);
    }

    public async deleteUser(userId: string): Promise<Omit<User, "password">> {
        const deletedUser = await this.prisma.user.delete({
            where: { id: userId },
        });
        return exclude(deletedUser, ["password"]);
    }

    public async createUser(
        userData: RegisterUserDto
    ): Promise<Omit<User, "password">> {
        const findUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });
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

        return exclude(createdUser, ["password"]);
    }
}
