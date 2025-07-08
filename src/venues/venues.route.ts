import { Router } from "express";
import { VenuesController } from "./venues.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateVenueDto } from "./dtos/create-venue.dto";
import { canManageVenue } from "../middleware/permission.middleware";
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
            canManageVenue,
            validationMiddleware(CreateVenueDto),
            this.controller.create
        );

        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            canManageVenue,
            validationMiddleware(CreateVenueDto, true),
            this.controller.update
        );

        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            canManageVenue,
            this.controller.delete
        );

        this.router.delete(
            `${this.path}/multiple`,
            authMiddleware,
            canManageVenue,
            this.controller.deleteMultiple
        );

        this.router.patch(
            `${this.path}/:id/approve`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.approve
        );
    }
}
