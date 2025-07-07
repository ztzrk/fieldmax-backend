import prisma from "../db";
import { CreateSportTypeDto } from "./dtos/create-sport-type.dto";

export class SportTypesService {
    public async findAll() {
        const sportTypes = await prisma.sportType.findMany();
        return sportTypes;
    }

    public async findById(id: string) {
        const sportType = await prisma.sportType.findUnique({ where: { id } });
        if (!sportType) throw new Error("Sport type not found");
        return sportType;
    }

    public async create(data: CreateSportTypeDto) {
        const findSportType = await prisma.sportType.findUnique({
            where: { name: data.name },
        });
        if (findSportType)
            throw new Error("Sport type with this name already exists");

        const newSportType = await prisma.sportType.create({ data });
        return newSportType;
    }

    public async update(id: string, data: CreateSportTypeDto) {
        const updatedSportType = await prisma.sportType.update({
            where: { id },
            data,
        });
        return updatedSportType;
    }

    public async delete(id: string) {
        try {
            const deletedSportType = await prisma.sportType.delete({
                where: { id },
            });
            return deletedSportType;
        } catch (error) {
            throw new Error(
                "Failed to delete sport type. It might be in use by some fields."
            );
        }
    }
    public async deleteMultiple(ids: string[]) {
        const deletedSportTypes = await prisma.sportType.deleteMany({
            where: { id: { in: ids } },
        });
        return deletedSportTypes;
    }
}
