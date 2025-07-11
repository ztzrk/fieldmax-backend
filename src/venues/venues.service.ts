import { User } from "@prisma/client";
import prisma from "../db";
import { CreateVenueDto } from "./dtos/create-venue.dto";
import e from "express";
import { supabase } from "../lib/supabase";

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
                photos: true,
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

    public async addPhotos(venueId: string, files: Express.Multer.File[]) {
        const timestamp = Date.now();

        const uploadPromises = files.map((file, index) => {
            const cleanOriginalName = file.originalname
                .trim()
                .replace(/\s+/g, "-");
            const fileName = `${venueId}-${Date.now()}-${cleanOriginalName}`;
            const filePath = `venue-photos/${fileName}`;

            return supabase.storage
                .from("fieldmax-assets")
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                });
        });

        const uploadResults = await Promise.all(uploadPromises);

        const photoDataToSave = uploadResults.map((result, index) => {
            if (result.error) {
                throw new Error(
                    `Failed to upload file: ${files[index].originalname}`
                );
            }
            const {
                data: { publicUrl },
            } = supabase.storage
                .from("fieldmax-assets")
                .getPublicUrl(result.data.path);

            return {
                venueId: venueId,
                url: publicUrl,
            };
        });

        const savedPhotos = await prisma.venuePhoto.createMany({
            data: photoDataToSave,
        });

        return savedPhotos;
    }

    public async deletePhoto(photoId: string) {
        const photo = await prisma.venuePhoto.findUnique({
            where: { id: photoId },
            select: { url: true },
        });

        if (photo) {
            const filePath = photo.url.split("/fieldmax-assets/")[1];
            await supabase.storage.from("fieldmax-assets").remove([filePath]);
        }

        return prisma.venuePhoto.delete({ where: { id: photoId } });
    }
}
