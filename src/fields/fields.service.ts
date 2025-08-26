import { Prisma, User } from "@prisma/client";
import prisma from "../db";
import { supabase } from "../lib/supabase";
import { CreateFieldDto, UpdateFieldDto } from "./dtos/field.dto";
import { ScheduleOverrideDto } from "./dtos/override.dto";
import { GetAvailabilityDto } from "./dtos/availability.dtos";
import { PaginationDto } from "../dtos/pagination.dto";

export class FieldsService {
    public async findAll(query: PaginationDto) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.FieldWhereInput = search
            ? {
                  name: {
                      contains: search,
                      mode: "insensitive",
                  },
              }
            : {};

        const [fields, total] = [
            await prisma.field.findMany({
                where: whereCondition,
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
                    venue: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    venue: {
                        name: "asc",
                    },
                },
            }),
            await prisma.field.count({ where: whereCondition }),
        ];
        const totalPages = Math.ceil(total / limit);

        return {
            data: fields,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    public async findById(id: string) {
        const field = await prisma.field.findUnique({
            where: { id },
            include: {
                sportType: true,
                photos: true,
            },
        });
        if (!field) throw new Error("Field not found");
        return field;
    }

    public async create(data: CreateFieldDto, user: User) {
        const venue = await prisma.venue.findUnique({
            where: { id: data.venueId },
        });
        if (!venue) throw new Error("Venue not found.");

        if (user.role === "RENTER" && venue.renterId !== user.id) {
            throw new Error("Forbidden: You do not own this venue.");
        }

        const { schedules, ...fieldData } = data;

        return prisma.$transaction(async (tx) => {
            const newField = await tx.field.create({ data: fieldData });
            if (schedules && schedules.length > 0) {
                await tx.fieldSchedule.createMany({
                    data: schedules.map((s) => ({
                        ...s,
                        fieldId: newField.id,
                    })),
                });
            }
            return newField;
        });
    }

    public async update(fieldId: string, data: UpdateFieldDto, user: User) {
        const fieldToUpdate = await prisma.field.findUnique({
            where: { id: fieldId },
            select: { venue: { select: { renterId: true } } },
        });
        if (!fieldToUpdate) throw new Error("Field not found.");

        if (
            user.role === "RENTER" &&
            fieldToUpdate.venue.renterId !== user.id
        ) {
            throw new Error("Forbidden: You do not own this field.");
        }

        const { schedules, ...fieldData } = data;
        return prisma.$transaction(async (tx) => {
            const updatedField = await tx.field.update({
                where: { id: fieldId },
                data: fieldData,
            });
            if (schedules) {
                await tx.fieldSchedule.deleteMany({
                    where: { fieldId: fieldId },
                });
                await tx.fieldSchedule.createMany({
                    data: schedules.map((s) => ({
                        ...s,
                        fieldId: updatedField.id,
                    })),
                });
            }
            return updatedField;
        });
    }

    public async delete(fieldId: string, user: User) {
        const fieldToDelete = await prisma.field.findUnique({
            where: { id: fieldId },
            select: { venue: { select: { renterId: true } } },
        });
        if (!fieldToDelete) throw new Error("Field not found.");

        if (
            user.role === "RENTER" &&
            fieldToDelete.venue.renterId !== user.id
        ) {
            throw new Error("Forbidden: You do not own this field.");
        }

        return prisma.field.delete({ where: { id: fieldId } });
    }

    public async deleteMultiple(ids: string[]) {
        const deletedFields = await prisma.field.deleteMany({
            where: { id: { in: ids } },
        });
        return deletedFields;
    }
    public async getOverrides(fieldId: string) {
        const overrides = await prisma.scheduleOverride.findMany({
            where: { fieldId },
            orderBy: { overrideDate: "asc" },
        });
        return overrides;
    }

    public async createOverride(fieldId: string, data: ScheduleOverrideDto) {
        const newOverride = await prisma.scheduleOverride.create({
            data: {
                fieldId,
                ...data,
            },
        });
        return newOverride;
    }

    public async deleteOverride(overrideId: string) {
        const deletedOverride = await prisma.scheduleOverride.delete({
            where: { id: overrideId },
        });
        return deletedOverride;
    }

    public async addPhotos(fieldId: string, files: Express.Multer.File[]) {
        const timestamp = Date.now();
        const uploadPromises = files.map((file, index) => {
            const cleanName = file.originalname.trim().replace(/\s+/g, "-");
            const fileName = `${fieldId}-${timestamp}-${
                index + 1
            }-${cleanName}`;
            const filePath = `field-photos/${fileName}`;
            return supabase.storage
                .from("fieldmax-assets")
                .upload(filePath, file.buffer, { contentType: file.mimetype });
        });

        const uploadResults = await Promise.all(uploadPromises);

        const photoDataToSave = uploadResults.map((result, index) => {
            if (result.error)
                throw new Error(
                    `Failed to upload file: ${files[index].originalname}`
                );
            const {
                data: { publicUrl },
            } = supabase.storage
                .from("fieldmax-assets")
                .getPublicUrl(result.data.path);
            return { fieldId, url: publicUrl };
        });

        return prisma.fieldPhoto.createMany({ data: photoDataToSave });
    }

    public async deletePhoto(photoId: string) {
        const photo = await prisma.fieldPhoto.findUnique({
            where: { id: photoId },
        });
        if (!photo) throw new Error("Photo not found");

        const { data, error } = await supabase.storage
            .from("fieldmax-assets")
            .remove([photo.url]);

        if (error) throw new Error(`Failed to delete photo: ${error.message}`);

        return prisma.fieldPhoto.delete({
            where: { id: photoId },
        });
    }

    public async getAvailability(fieldId: string, query: GetAvailabilityDto) {
        const requestedDate = new Date(query.date);
        const dayOfWeek =
            requestedDate.getUTCDay() === 0 ? 7 : requestedDate.getUTCDay();

        const override = await prisma.scheduleOverride.findFirst({
            where: {
                fieldId: fieldId,
                overrideDate: requestedDate,
            },
        });

        let openTimeStr: Date | null = null;
        let closeTimeStr: Date | null = null;
        let isClosed = false;

        if (override) {
            if (override.isClosed) {
                isClosed = true;
            } else {
                openTimeStr = override.openTime;
                closeTimeStr = override.closeTime;
            }
        } else {
            const regularSchedules = await prisma.fieldSchedule.findMany({
                where: { fieldId: fieldId, dayOfWeek: dayOfWeek },
            });
            if (regularSchedules.length > 0) {
                openTimeStr = regularSchedules[0].openTime;
                closeTimeStr = regularSchedules[0].closeTime;
            } else {
                isClosed = true;
            }
        }

        if (isClosed || !openTimeStr || !closeTimeStr) {
            return [];
        }

        const possibleSlots = [];
        const openHour = openTimeStr.getUTCHours();
        const closeHour = closeTimeStr.getUTCHours();
        for (let hour = openHour; hour < closeHour; hour++) {
            possibleSlots.push(`${hour.toString().padStart(2, "0")}:00`);
        }

        const bookings = await prisma.booking.findMany({
            where: {
                fieldId: fieldId,
                bookingDate: requestedDate,
                status: "CONFIRMED",
            },
            select: {
                startTime: true,
            },
        });

        const bookedSlots = new Set(
            bookings.map((b) => b.startTime.toISOString().substring(0, 5))
        );

        const availableSlots = possibleSlots.filter(
            (slot) => !bookedSlots.has(slot)
        );

        return availableSlots;
    }
}
