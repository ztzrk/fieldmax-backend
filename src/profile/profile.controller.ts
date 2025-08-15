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
}
