import { Router, Response, NextFunction, Request } from "express";
import { SportTypesController } from "./sport-types.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateSportTypeDto, UpdateSportTypeDto } from "./dtos/sport-type.dto";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";

export class SportTypesRoute {
    public path = "/sport-types";
    public router = Router();
    public controller = new SportTypesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getAll);

        this.router.post(
            `${this.path}`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(CreateSportTypeDto),
            this.controller.create
        );

        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(UpdateSportTypeDto, true),
            this.controller.update
        );

        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.delete
        );
        this.router.post(
            `${this.path}/multiple`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.deleteMultiple
        );
    }
}
