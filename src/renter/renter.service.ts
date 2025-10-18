import { Prisma } from "@prisma/client";
import prisma from "../db";
import { PaginationDto } from "../dtos/pagination.dto";

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
        query: PaginationDto
    ) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.VenueWhereInput = search
            ? {
                  name: {
                      contains: search,
                      mode: "insensitive",
                  },
              }
            : {};

        const [venues, total] = await prisma.$transaction([
            prisma.venue.findMany({
                where: {
                    renterId,
                    AND: whereCondition,
                },
                include: {
                    renter: {
                        select: {
                            fullName: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: { fields: true },
                    },
                },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.venue.count({
                where: {
                    renterId,
                    AND: whereCondition,
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return { data: venues, meta: { total, page, limit, totalPages } };
    }

    public async findMyBookingsWithPagination(
        renterId: string,
        query: PaginationDto
    ) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.BookingWhereInput = {
            field: {
                venue: {
                    renterId,
                },
            },
            AND: search
                ? [
                      {
                          field: {
                              name: {
                                  contains: search,
                                  mode: "insensitive",
                              },
                          },
                      },
                  ]
                : [],
        };

        const [bookings, total] = await prisma.$transaction([
            prisma.booking.findMany({
                where: whereCondition,
                include: {
                    field: {
                        include: {
                            venue: true,
                        },
                    },
                },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.booking.count({ where: whereCondition }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return { data: bookings, meta: { total, page, limit, totalPages } };
    }

    public async findMyFieldsWithPagination(
        renterId: string,
        query: PaginationDto
    ) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.FieldWhereInput = {
            venue: {
                renterId,
            },
            AND: search
                ? [
                      {
                          name: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                  ]
                : [],
        };

        const [fields, total] = await prisma.$transaction([
            prisma.field.findMany({
                where: whereCondition,
                include: {
                    venue: true,
                    _count: {
                        select: { bookings: true },
                    },
                },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.field.count({ where: whereCondition }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return { data: fields, meta: { total, page, limit, totalPages } };
    }
}
