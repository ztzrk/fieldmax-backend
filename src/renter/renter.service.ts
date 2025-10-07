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

    public async completeBooking(bookingId: string) {
        return prisma.booking.update({
            where: { id: bookingId },
            data: { status: "COMPLETED" },
        });
    }

    public async findMyFields(renterId: string) {
        return prisma.field.findMany({
            where: {
                venue: {
                    renterId,
                },
            },
            include: {
                venue: true,
                _count: {
                    select: { bookings: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    public async findMyFieldById(renterId: string, fieldId: string) {
        return prisma.field.findFirst({
            where: {
                id: fieldId,
                venue: {
                    renterId,
                },
            },
            include: {
                venue: true,
                _count: {
                    select: { bookings: true },
                },
            },
        });
    }

    public async countMyBookings(renterId: string) {
        return prisma.booking.count({
            where: {
                field: {
                    venue: {
                        renterId,
                    },
                },
            },
        });
    }

    public async countMyVenues(renterId: string) {
        return prisma.venue.count({
            where: { renterId },
        });
    }

    public async countMyFields(renterId: string) {
        return prisma.field.count({
            where: {
                venue: {
                    renterId,
                },
            },
        });
    }

    public async findMyVenuesWithPagination(
        renterId: string,
        page: number,
        pageSize: number
    ) {
        const venues = await prisma.venue.findMany({
            where: { renterId },
            include: {
                _count: {
                    select: { fields: true },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalCount = await prisma.venue.count({
            where: { renterId },
        });

        return {
            venues,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
        };
    }
}
