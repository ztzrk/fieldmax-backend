import { User, Prisma } from "@prisma/client";
import prisma from "../db";
import { CreateVenueDto, UpdateVenueDto } from "./dtos/venue.dto";
import e from "express";
import { supabase } from "../lib/supabase";
import { PaginationDto } from "../dtos/pagination.dto";

export class VenuesService {
    public async findAllAdmin(query: PaginationDto) {
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

        const [venues, total] = [
            await prisma.venue.findMany({
                where: whereCondition,
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
            await prisma.venue.count({ where: whereCondition }),
        ];

        const totalPages = Math.ceil(total / limit);

        return { data: venues, meta: { total, page, limit, totalPages } };
    }

    public async findAllForRenter(renterId: string, query: PaginationDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.VenueWhereInput = {
            renterId: renterId,
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

        const [venues, total] = [
            await prisma.venue.findMany({
                where: whereCondition,
                include: {
                    _count: {
                        select: { fields: true },
                    },
                },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            await prisma.venue.count({ where: whereCondition }),
        ];
        const totalPages = Math.ceil(total / limit);

        return { data: venues, meta: { total, page, limit, totalPages } };
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
            select: {
                id: true,
                name: true,
                address: true,
                description: true,
                status: true,
                rejectionReason: true,
                renterId: true,
                renter: {
                    select: {
                        fullName: true,
                    },
                },
                photos: true,
                fields: {
                    select: {
                        id: true,
                        name: true,
                        pricePerHour: true,
                        status: true,
                        sportType: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!venue) throw new Error("Venue not found");

        const transformedVenue = {
            ...venue,
            renterName: venue.renter.fullName,
            fields: venue.fields.map((field) => ({
                ...field,
                sportTypeName: field.sportType.name,
            })),
        };

        return transformedVenue;
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

        const newVenue = await prisma.venue.create({
            data,
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
        });

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

    public async approve(id: string) {
        const venueWithPhotoCount = await prisma.venue.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { photos: true },
                },
            },
        });

        if (!venueWithPhotoCount) {
            throw new Error("Venue not found.");
        }

        if (venueWithPhotoCount._count.photos < 3) {
            throw new Error(
                "Venue must have at least 3 photos to be approved."
            );
        }

        return prisma.venue.update({
            where: { id },
            data: { status: "APPROVED" },
        });
    }

    public async reject(id: string, data: { rejectionReason: string }) {
        return prisma.venue.update({
            where: { id },
            data: {
                status: "REJECTED",
                rejectionReason: data.rejectionReason,
            },
        });
    }

    public async resubmit(id: string) {
        const venueToUpdate = await prisma.venue.findUnique({ where: { id } });

        if (!venueToUpdate) {
            throw new Error("Venue not found.");
        }

        if (venueToUpdate.status !== "REJECTED") {
            throw new Error("Only rejected venues can be resubmitted.");
        }

        return prisma.venue.update({
            where: { id },
            data: {
                status: "PENDING",
                rejectionReason: null,
            },
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
