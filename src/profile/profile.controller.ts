import { NextFunction, Request, Response } from "express";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dtos/update-profile.dto";

export class ProfileController {
    public service = new ProfileService();

    public updateProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.id;
            const profileData: UpdateProfileDto = req.body;
            const data = await this.service.updateProfile(userId, profileData);
            res.status(200).json({ data, message: "Profile updated" });
        } catch (error) {
            next(error);
        }
    };

    public getProfile = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.id;
            const data = await this.service.getProfile(userId);
            res.status(200).json({ data, message: "Profile fetched" });
        } catch (error) {
            next(error);
        }
    };

    public changePassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.id;
            const { newPassword } = req.body;
            await this.service.changePassword(userId, newPassword);
            res.status(200).json({ message: "Password changed" });
        } catch (error) {
            next(error);
        }
    };

    public deleteAccount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.id;
            await this.service.deleteAccount(userId);
            res.status(200).json({ message: "Account deleted" });
        } catch (error) {
            next(error);
        }
    };
}
