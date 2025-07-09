import { User } from "@prisma/client";
import prisma from "../db";
import { CreateVenueDto } from "./dtos/create-venue.dto";
import e from "express";

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

        const renter = await prisma.user.findFirst({
            where: { id: data.renterId, role: "RENTER" },
        });
        if (!renter) throw new Error("Invalid renter ID provided.");

        const existingVenue = await prisma.venue.findFirst({
            where: {
                name: data.name,
                renterId: data.renterId,
            },
        });
        if (existingVenue) {
            throw new Error(
                "A venue with this name already exists for this renter."
            );
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

    public async reject(id: string) {
        return prisma.venue.update({
            where: { id },
            data: { status: "REJECTED" },
        });
    }
}
