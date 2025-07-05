import { Router, Response, NextFunction, Request } from "express";
import { VenuesController } from "./venues.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateVenueDto, UpdateVenueDto } from "./dtos/venue.dto";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";

export class VenuesRoute {
    public path = "/venues";
    public router = Router();
    public controller = new VenuesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAll);
        this.router.get(`${this.path}/:id`, this.controller.getById);

        this.router.post(
            `${this.path}`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(CreateVenueDto),
            this.controller.create
        );

        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(UpdateVenueDto, true),
            this.controller.update
        );

        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.delete
        );
    }
}
