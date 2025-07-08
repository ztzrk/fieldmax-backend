import prisma from "../db";

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
    public async create(data: any) {
        const newField = await prisma.field.create({
            data,
            include: {
                sportType: true,
            },
        });
        return newField;
    }
    public async update(id: string, data: any) {
        const updatedField = await prisma.field.update({
            where: { id },
            data,
            include: {
                sportType: true,
            },
        });
        return updatedField;
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
}
