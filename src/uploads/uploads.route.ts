import { Router } from "express";
import { UploadsController } from "./uploads.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from "multer";
import { canManageVenue } from "../middleware/permission.middleware";

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
            `${this.path}/:venueId/photos`,
            authMiddleware,
            canManageVenue,
            upload.array("photos", 5),
            this.controller.uploadVenuePhotos
        );
    }
}
