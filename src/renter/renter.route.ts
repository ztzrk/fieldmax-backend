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

        this.router.get(
            `${this.path}/venues/:id`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyVenueById
        );

        this.router.get(
            `${this.path}/bookings`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyBookings
        );

        this.router.get(
            `${this.path}/bookings/:id`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyBookingById
        );

        this.router.put(
            `${this.path}/bookings/:id/confirm`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.confirmBooking
        );

        this.router.put(
            `${this.path}/bookinsg/:id/cancel`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.cancelBooking
        );

        this.router.put(
            `${this.path}/bookings/:id/complete`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.completeBooking
        );

        this.router.get(
            `${this.path}/fields`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyFields
        );

        this.router.get(
            `${this.path}/fields/:id`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyFieldById
        );

        this.router.get(
            `${this.path}/bookings/count`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.countMyBookings
        );

        this.router.get(
            `${this.path}/fields/count`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.countMyFields
        );

        this.router.get(
            `${this.path}/venues/count`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.countMyVenues
        );

        this.router.get(
            `${this.path}/venues/pagination`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyVenuesWithPagination
        );

        this.router.get(
            `${this.path}/bookings/pagination`,
            authMiddleware,
            renterOnlyMiddleware,
            this.controller.getMyBookingsWithPagination
        );
    }
}
