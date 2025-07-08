import { NextFunction, Request, Response } from "express";
import { FieldsService } from "./fields.service";
import { CreateFieldDto } from "./dtos/create-field.dto";
import { ScheduleOverrideDto } from "./dtos/override.dto";

export class FieldsController {
    public service = new FieldsService();

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.service.findAll();
            res.status(200).json({ data, message: "findAll" });
        } catch (error) {
            next(error);
        }
    };

    public getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const data = await this.service.findById(id);
            res.status(200).json({ data, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fieldData = req.body;
            const data = await this.service.create(fieldData);
            res.status(201).json({ data, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const fieldData: CreateFieldDto = req.body;
            const data = await this.service.update(id, fieldData);
            res.status(200).json({ data, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await this.service.delete(id);
            res.status(200).json({ data, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

    public deleteMultiple = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { ids } = req.body;
            const data = await this.service.deleteMultiple(ids);
            res.status(200).json({ data, message: "deleted multiple" });
        } catch (error) {
            next(error);
        }
    };
    public getOverrides = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { fieldId } = req.params;
            const data = await this.service.getOverrides(fieldId);
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };

    public createOverride = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { fieldId } = req.params;
            const overrideData: ScheduleOverrideDto = req.body;
            const data = await this.service.createOverride(
                fieldId,
                overrideData
            );
            res.status(201).json({ data, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public deleteOverride = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { overrideId } = req.params;
            const data = await this.service.deleteOverride(overrideId);
            res.status(200).json({ data, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };
}
