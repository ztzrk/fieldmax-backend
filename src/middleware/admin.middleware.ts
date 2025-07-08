import { Response, NextFunction, Request } from "express";

export const adminOnlyMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Requires Admin role" });
    }
};
