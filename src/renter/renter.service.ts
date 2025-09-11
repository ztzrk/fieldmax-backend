import prisma from "../db";

export class RenterService {
    public async findMyVenues(renterId: string) {
        return prisma.venue.findMany({
            where: { renterId },
            include: {
                _count: {
                    select: { fields: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    public async findMyVenueById(renterId: string, venueId: string) {
        return prisma.venue.findFirst({
            where: { id: venueId, renterId },
            include: {
                _count: {
                    select: { fields: true },
                },
            },
        });
    }

    public async findMyBookings(renterId: string) {
        return prisma.booking.findMany({
            where: {
                field: {
                    venue: {
                        renterId,
                    },
                },
            },
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    public async findMyBookingById(renterId: string, bookingId: string) {
        return prisma.booking.findFirst({
            where: {
                id: bookingId,
                field: {
                    venue: {
                        renterId,
                    },
                },
            },
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
            },
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
