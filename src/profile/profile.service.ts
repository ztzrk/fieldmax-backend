import prisma from "../db";
import { UpdateProfileDto } from "./dtos/update-profile.dto";

export class ProfileService {
    public async updateProfile(userId: string, data: UpdateProfileDto) {
        const { fullName, phoneNumber, ...profileData } = data;

        return prisma.$transaction(async (tx) => {
            if (fullName || phoneNumber) {
                await tx.user.update({
                    where: { id: userId },
                    data: { fullName, phoneNumber },
                });
            }

            const updatedProfile = await tx.userProfile.upsert({
                where: { userId },
                update: profileData,
                create: {
                    userId,
                    ...profileData,
                },
            });

            return updatedProfile;
        });
    }

    public async getProfile(userId: string) {
        return prisma.userProfile.findUnique({
            where: { userId },
        });
    }

    public async changePassword(userId: string, newPassword: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
    }

    public async deleteAccount(userId: string) {
        return prisma.user.delete({
            where: { id: userId },
        });
    }
}
