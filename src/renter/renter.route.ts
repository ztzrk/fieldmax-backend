import { Router } from "express";
import { RenterController } from "./renter.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { renterOnlyMiddleware } from "../middleware/permission.middleware";

export class RenterRoute {
    public path = "/renter";
    public router = Router();
    public controller = new RenterController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/venues`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyVenues
        );
    }
}
