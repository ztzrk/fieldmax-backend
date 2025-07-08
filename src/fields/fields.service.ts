import prisma from "../db";
import { CreateFieldDto } from "./dtos/create-field.dto";
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
}
