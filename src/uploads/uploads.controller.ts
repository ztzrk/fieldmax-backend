import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { VenuesService } from "../venues/venues.service";

export class UploadsController {
    public uploadVenuePhotos = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { venueId } = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                throw new Error("No files uploaded.");
            }

            const venueService = new VenuesService();
            const savedPhotos = await venueService.addPhotos(venueId, files);

            res.status(201).json({
                data: savedPhotos,
                message: "Photos uploaded successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
