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

    public getMyVenueById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const venueId = req.params.id;
            const data = await this.service.findMyVenueById(renterId, venueId);
            if (!data) {
                return res.status(404).json({ message: "Venue not found" });
            }
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };
}
