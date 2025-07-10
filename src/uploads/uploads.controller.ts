import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";

export class UploadsController {
    public directUpload = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.file) {
                throw new Error("No file uploaded.");
            }

            const file = req.file;
            const filePath = `public/${Date.now()}-${file.originalname}`;

            const { data, error } = await supabase.storage
                .from("fieldmax-assets")
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                });

            if (error) throw error;

            const {
                data: { publicUrl },
            } = supabase.storage.from("fieldmax-assets").getPublicUrl(filePath);

            res.status(200).json({ data: { publicUrl } });
        } catch (error) {
            next(error);
        }
    };
}
