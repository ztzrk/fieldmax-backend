import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateBookingDto } from "./dtos/create-booking.dto";

export class BookingsRoute {
    public path = "/bookings";
    public router = Router();
    public controller = new BookingsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            authMiddleware,
            validationMiddleware(CreateBookingDto),
            this.controller.create
        );
    }
}
