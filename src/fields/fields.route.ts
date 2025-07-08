import { Router } from "express";
import { FieldsController } from "./fields.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { canManageField } from "../middleware/permission.middleware";

export class FieldsRoute {
    public path = "/fields";
    public router = Router();
    public controller = new FieldsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAll);
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
            validationMiddleware(CreateFieldDto, true),
            this.controller.update
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            canManageField,
            this.controller.delete
        );
        this.router.delete(
            `${this.path}/multiple`,
            authMiddleware,
            canManageField,
            this.controller.deleteMultiple
        );
    }
}
