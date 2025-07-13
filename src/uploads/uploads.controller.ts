import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import { VenuesService } from "../venues/venues.service";
import { FieldsService } from "../fields/fields.service";

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

    public uploadFieldPhotos = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { fieldId } = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                throw new Error("No files uploaded.");
            }

            const fieldService = new FieldsService();
            const savedPhotos = await fieldService.addPhotos(fieldId, files);

            res.status(201).json({
                data: savedPhotos,
                message: "Photos uploaded successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
