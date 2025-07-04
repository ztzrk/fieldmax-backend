import { NextFunction, Request, Response } from "express";
import { VenuesService } from "./venues.service";
import { CreateVenueDto, UpdateVenueDto } from "./dtos/venue.dto";

export class VenuesController {
    public service = new VenuesService();

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.service.findAll();
            res.status(200).json({ data, message: "findAll" });
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
            const data = await this.service.create(venueData);
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
}
