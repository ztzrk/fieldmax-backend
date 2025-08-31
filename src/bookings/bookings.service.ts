import prisma from "../db";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import midtransclient from "midtrans-client";
import { Prisma, User } from "@prisma/client";
import { PaginationDto } from "../dtos/pagination.dto";

export class BookingsService {
    private snap = new midtransclient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    public async findAllBookings(query: PaginationDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.BookingWhereInput = {
            ...(search && {
                OR: [
                    { id: { contains: search } },
                    { user: { fullName: { contains: search } } },
                    { field: { name: { contains: search } } },
                ],
            }),
        };

        const [bookings, total] = await prisma.$transaction([
            prisma.booking.findMany({
                skip,
                take: limit,
                where: whereCondition,
            }),
            prisma.booking.count({
                where: whereCondition,
            }),
        ]);
        const totalPages = Math.ceil(total / limit);

        return { data: bookings, meta: { total, page, limit, totalPages } };
    }

    public async findBookingById(bookingId: string) {
        return prisma.booking.findUnique({
            where: { id: bookingId },
        });
    }

    public async createBooking(data: CreateBookingDto, user: User) {
        const field = await prisma.field.findUnique({
            where: { id: data.fieldId },
        });
        if (!field) throw new Error("Field not found");

        const startTime = new Date(
            `${data.bookingDate}T${data.startTime}:00.000Z`
        );
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        const existingBooking = await prisma.booking.findFirst({
            where: {
                fieldId: data.fieldId,
                bookingDate: new Date(data.bookingDate),
                startTime: { gte: startTime, lt: endTime },
                status: "CONFIRMED",
            },
        });
        if (existingBooking)
            throw new Error("This time slot is already booked.");

        const totalPrice = field.pricePerHour;

        return prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
                data: {
                    userId: user.id,
                    fieldId: data.fieldId,
                    bookingDate: new Date(data.bookingDate),
                    startTime: startTime,
                    endTime: endTime,
                    totalPrice: totalPrice,
                    status: "PENDING",
                },
            });

            const transactionDetails = {
                transaction_details: {
                    order_id: newBooking.id,
                    gross_amount: totalPrice,
                },
                customer_details: {
                    first_name: user.fullName,
                    email: user.email,
                },
                item_details: [
                    {
                        id: field.id,
                        price: totalPrice,
                        quantity: 1,
                        name: `${field.name} on ${data.bookingDate}`,
                    },
                ],
            };

            const transactionToken = await this.snap.createTransactionToken(
                transactionDetails
            );

            await tx.booking.update({
                where: { id: newBooking.id },
                data: { snapToken: transactionToken },
            });

            return { booking: newBooking, snapToken: transactionToken };
        });
    }

    public async confirmBooking(bookingId: string) {
        return prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
        });
    }

    public async cancelBooking(bookingId: string) {
        return prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" },
        });
    }
}
