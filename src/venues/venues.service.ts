import { User } from "@prisma/client";
import prisma from "../db";
import { CreateVenueDto } from "./dtos/create-venue.dto";

export class VenuesService {
    public async findAllAdmin() {
        const venues = await prisma.venue.findMany({
            include: {
                renter: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        return venues;
    }

    public async findAllForRenter(renterId: string) {
        const venues = await prisma.venue.findMany({
            where: { renterId },
            include: {
                renter: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        return venues;
    }

    public async findAllPublic() {
        const venues = await prisma.venue.findMany({
            where: { status: "APPROVED" },
            include: {
                renter: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        return venues;
    }

    public async findById(id: string) {
        const venue = await prisma.venue.findUnique({
            where: { id },
            include: {
                fields: true,
                renter: true,
            },
        });
        if (!venue) throw new Error("Venue not found");
        return venue;
    }

    public async create(data: CreateVenueDto, creatingUser: User) {
        if (creatingUser.role === "RENTER") {
            data.renterId = creatingUser.id;
        }

        const existingVenue = await prisma.venue.findUnique({
            where: { name: data.name },
        });
        const renter = await prisma.user.findFirst({
            where: { id: data.renterId },
        });

        if (existingVenue) {
            throw new Error("Venue with this name already exists.");
        }

        if (!renter || renter.role !== "RENTER") {
            throw new Error("Invalid renter ID provided.");
        }

        const newVenue = await prisma.venue.create({ data });
        return newVenue;
    }

    public async update(id: string, data: CreateVenueDto) {
        const updatedVenue = await prisma.venue.update({
            where: { id },
            data,
        });
        return updatedVenue;
    }

    public async delete(id: string) {
        const deletedVenue = await prisma.venue.delete({ where: { id } });
        return deletedVenue;
    }

    public async deleteMultiple(ids: string[]) {
        const deletedVenues = await prisma.venue.deleteMany({
            where: { id: { in: ids } },
        });
        return deletedVenues;
    }

    public async approve(id: string) {
        return prisma.venue.update({
            where: { id },
            data: { status: "APPROVED" },
        });
    }
}
