import { Router } from "express";
import { FieldsController } from "./fields.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateFieldDto, UpdateFieldDto } from "./dtos/field.dto";
import { canManageField } from "../middleware/permission.middleware";
import { ScheduleOverrideDto } from "./dtos/override.dto";
import { GetAvailabilityDto } from "./dtos/availability.dtos";
import { PaginationDto } from "../dtos/pagination.dto";

export class FieldsRoute {
    public path = "/fields";
    public router = Router();
    public controller = new FieldsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            validationMiddleware(PaginationDto, true, true),
            this.controller.getAll
        );
        this.router.get(`${this.path}/:id`, this.controller.getById);
        this.router.post(
            `${this.path}`,
            authMiddleware,
            canManageField,
            validationMiddleware(CreateFieldDto),
            this.controller.create
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            canManageField,
            validationMiddleware(UpdateFieldDto, true),
            this.controller.update
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            canManageField,
            this.controller.delete
        );
        this.router.post(
            `${this.path}/multiple`,
            authMiddleware,
            canManageField,
            this.controller.deleteMultiple
        );
        this.router.get(
            `${this.path}/:fieldId/overrides`,
            authMiddleware,
            canManageField,
            this.controller.getOverrides
        );

        this.router.post(
            `${this.path}/:fieldId/overrides`,
            authMiddleware,
            canManageField,
            validationMiddleware(ScheduleOverrideDto),
            this.controller.createOverride
        );

        this.router.delete(
            `${this.path}/:fieldId/overrides/:overrideId`,
            authMiddleware,
            canManageField,
            this.controller.deleteOverride
        );

        this.router.delete(
            `${this.path}/photos/:photoId`,
            authMiddleware,
            canManageField,
            this.controller.deletePhoto
        );
        this.router.get(
            `${this.path}/:fieldId/availability`,
            validationMiddleware(GetAvailabilityDto, true, true),
            this.controller.getAvailability
        );
    }
}
