import { Router } from "express";
import { PaymentsController } from "./payments.controller";

export class PaymentsRoute {
    public path = "/payments";
    public router = Router();
    public controller = new PaymentsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/midtrans-notification`,
            this.controller.handleNotification
        );
    }
}
