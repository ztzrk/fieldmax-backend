import { NextFunction, Request, Response } from "express";
import { PaymentsService } from "./payments.service";

export class PaymentsController {
    public service = new PaymentsService();

    public handleNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notificationJson = req.body;
            await this.service.handleMidtransNotification(notificationJson);
            res.status(200).json({
                message: "Notification received successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}
