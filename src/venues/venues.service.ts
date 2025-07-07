import prisma from "../db";
import { CreateVenueDto, UpdateVenueDto } from "./dtos/venue.dto";

export class VenuesService {
    public async findAll() {
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

    public async create(data: CreateVenueDto) {
        const renter = await prisma.user.findUnique({
            where: { id: data.renterId },
        });
        if (!renter || renter.role !== "RENTER") {
            throw new Error("Invalid renter ID provided.");
        }

        const newVenue = await prisma.venue.create({ data });
        return newVenue;
    }

    public async update(id: string, data: UpdateVenueDto) {
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
}
