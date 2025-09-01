import { NextFunction, Request, Response } from "express";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dtos/create-booking.dto";

export class BookingsController {
    public service = new BookingsService();

    public findAll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const query = req.query;
            const data = await this.service.findAllBookings(query);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    };

    public findOne = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { bookingId } = req.params;
            const data = await this.service.findBookingById(bookingId);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bookingData: CreateBookingDto = req.body;
            const user = req.user!;
            const data = await this.service.createBooking(bookingData, user);
            res.status(201).json({
                data,
                message: "Booking created, awaiting payment.",
            });
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
            const { bookingId } = req.params;
            const data = await this.service.confirmBooking(bookingId);
            res.status(200).json({
                data,
                message: "Booking confirmed.",
            });
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
            const { bookingId } = req.params;
            const data = await this.service.cancelBooking(bookingId);
            res.status(200).json({
                data,
                message: "Booking canceled.",
            });
        } catch (error) {
            next(error);
        }
    };
}
