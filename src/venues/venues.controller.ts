import { NextFunction, Request, Response } from "express";
import { VenuesService } from "./venues.service";
import { CreateVenueDto, UpdateVenueDto } from "./dtos/venue.dto";

export class VenuesController {
    public service = new VenuesService();

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.user && req.user.role === "ADMIN") {
                const data = await this.service.findAllAdmin(req.query);
                res.status(200).json({ data, message: "findAllAdmin" });
            } else if (req.user && req.user.role === "RENTER") {
                const data = await this.service.findAllForRenter(
                    req.user.id,
                    req.query
                );
                res.status(200).json({ data, message: "findAllForRenter" });
            } else {
                const data = await this.service.findAllPublic();
                res.status(200).json({ data, message: "findAllPublic" });
            }
        } catch (error) {
            next(error);
        }
    };

    public getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const data = await this.service.findById(id);
            res.status(200).json({ data, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const venueData: CreateVenueDto = req.body;
            const data = await this.service.create(venueData, req.user!);
            res.status(201).json({ data, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const venueData: UpdateVenueDto = req.body;
            const data = await this.service.update(id, venueData);
            res.status(200).json({ data, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await this.service.delete(id);
            res.status(200).json({ data, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

    public deleteMultiple = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { ids } = req.body;
            const data = await this.service.deleteMultiple(ids);
            res.status(200).json({ data, message: "deleted multiple" });
        } catch (error) {
            next(error);
        }
    };
    public approve = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const data = await this.service.approve(id);
            res.status(200).json({ data, message: "venue approved" });
        } catch (error) {
            next(error);
        }
    };
    public reject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const rejectedVenue = await this.service.reject(id, data);
            res.status(200).json({
                data: rejectedVenue,
                message: "venue rejected",
            });
        } catch (error) {
            next(error);
        }
    };

    public resubmit = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const data = await this.service.resubmit(id);
            res.status(200).json({
                data,
                message: "Venue resubmitted for review",
            });
        } catch (error) {
            next(error);
        }
    };

    public deletePhoto = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { photoId } = req.params;
            await this.service.deletePhoto(photoId);
            res.status(200).json({ message: "Photo deleted" });
        } catch (error) {
            next(error);
        }
    };
}
