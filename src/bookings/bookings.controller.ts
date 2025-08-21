import { NextFunction, Request, Response } from "express";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dtos/create-booking.dto";

export class BookingsController {
    public service = new BookingsService();

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
}
