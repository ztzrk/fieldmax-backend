import { Router } from "express";
import { UploadsController } from "./uploads.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export class UploadsRoute {
    public path = "/uploads";
    public router = Router();
    public controller = new UploadsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/direct`,
            authMiddleware,
            upload.single("file"),
            this.controller.directUpload
        );
    }
}
