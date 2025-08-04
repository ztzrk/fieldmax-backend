import { NextFunction, Request, Response } from "express";
import { RenterService } from "./renter.service";

export class RenterController {
    public service = new RenterService();

    public getMyVenues = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const data = await this.service.findMyVenues(renterId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };
}
