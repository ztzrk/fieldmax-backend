import { Router } from "express";
import { VenuesController } from "./venues.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
    CreateVenueDto,
    RejectVenueDto,
    UpdateVenueDto,
} from "./dtos/venue.dto";
import {
    canManageVenue,
    isVenueOwner,
} from "../middleware/permission.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { PaginationDto } from "../dtos/pagination.dto";

export class VenuesRoute {
    public path = "/venues";
    public router = Router();
    public controller = new VenuesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            authMiddleware,
            validationMiddleware(PaginationDto, true, true),
            this.controller.getAll
        );

        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            this.controller.getById
        );

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
            validationMiddleware(UpdateVenueDto, true),
            this.controller.update
        );

        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            canManageVenue,
            this.controller.delete
        );

        this.router.post(
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

        this.router.patch(
            `${this.path}/:id/reject`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(RejectVenueDto),
            this.controller.reject
        );

        this.router.patch(
            `${this.path}/:id/resubmit`,
            authMiddleware,
            isVenueOwner,
            this.controller.resubmit
        );

        this.router.delete(
            `${this.path}/photos/:photoId`,
            authMiddleware,
            canManageVenue,
            this.controller.deletePhoto
        );
    }
}
