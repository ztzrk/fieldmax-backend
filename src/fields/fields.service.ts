import prisma from "../db";
import { supabase } from "../lib/supabase";
import { CreateFieldDto } from "./dtos/field.dto";
import { ScheduleOverrideDto } from "./dtos/override.dto";

export class FieldsService {
    public async findAll() {
        const fields = await prisma.field.findMany({
            include: {
                sportType: true,
            },
        });
        return fields;
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
    public async create(data: CreateFieldDto) {
        const { schedules, ...fieldData } = data;

        return prisma.$transaction(async (tx) => {
            const newField = await tx.field.create({
                data: fieldData,
            });

            if (schedules && schedules.length > 0) {
                const scheduleData = schedules.map((schedule) => ({
                    ...schedule,
                    fieldId: newField.id,
                }));
                await tx.fieldSchedule.createMany({
                    data: scheduleData,
                });
            }

            return newField;
        });
    }

    public async update(id: string, data: CreateFieldDto) {
        const { schedules, ...fieldData } = data;

        return prisma.$transaction(async (tx) => {
            const updatedField = await tx.field.update({
                where: { id },
                data: fieldData,
            });

            await tx.fieldSchedule.deleteMany({
                where: { fieldId: id },
            });

            if (schedules && schedules.length > 0) {
                const scheduleData = schedules.map((schedule) => ({
                    ...schedule,
                    fieldId: updatedField.id,
                }));
                await tx.fieldSchedule.createMany({
                    data: scheduleData,
                });
            }

            return updatedField;
        });
    }

    public async delete(id: string) {
        try {
            const deletedField = await prisma.field.delete({
                where: { id },
            });
            return deletedField;
        } catch (error) {
            throw new Error(
                "Failed to delete field. It might be in use by some schedules."
            );
        }
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
}
