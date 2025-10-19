import { NextFunction, Request, Response } from "express";
import { RenterService } from "./renter.service";

export class RenterController {
    public service = new RenterService();

    public getMyVenues = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const data = await this.service.findMyVenues(renterId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public getMyVenueById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const venueId = req.params.id;
            const data = await this.service.findMyVenueById(renterId, venueId);
            if (!data) {
                res.status(404).json({ message: "Venue not found" });
            }
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public getMyBookings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const data = await this.service.findMyBookings(renterId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public getMyBookingById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const bookingId = req.params.id;
            const data = await this.service.findMyBookingById(
                renterId,
                bookingId
            );
            if (!data) {
                res.status(404).json({ message: "Booking not found" });
            }
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public confirmBooking = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const bookingId = req.params.id;
            const data = await this.service.confirmBooking(bookingId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public cancelBooking = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const bookingId = req.params.id;
            const data = await this.service.cancelBooking(bookingId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public completeBooking = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const bookingId = req.params.id;
            const data = await this.service.completeBooking(bookingId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public getMyFields = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const data = await this.service.findMyFields(renterId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public getMyFieldById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const fieldId = req.params.id;
            const data = await this.service.findMyFieldById(renterId, fieldId);
            if (!data) {
                res.status(404).json({ message: "Field not found" });
            }
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public countMyBookings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const count = await this.service.countMyBookings(renterId);
            res.status(200).json({ count });
        } catch (error) {
            next(error);
        }
    };

    public countMyFields = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const count = await this.service.countMyFields(renterId);
            res.status(200).json({ count });
        } catch (error) {
            next(error);
        }
    };

    public countMyVenues = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const count = await this.service.countMyVenues(renterId);
            res.status(200).json({ count });
        } catch (error) {
            next(error);
        }
    };

    public getMyVenuesWithPagination = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const data = await this.service.findMyVenuesWithPagination(
                renterId,
                req.query
            );
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public getMyFieldsWithPagination = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const data = await this.service.findMyFieldsWithPagination(
                renterId,
                req.query
            );
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public getMyBookingsWithPagination = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user!.id;
            const data = await this.service.findMyBookingsWithPagination(
                renterId,
                req.query
            );
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };
}
