import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const canManageVenue = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const venueId = req.params.id;

        if (!user) res.status(401).json({ message: "Not authenticated" });
        if (user && user.role === "ADMIN") next();
        else if (user && user.role === "RENTER") {
            const venue = await prisma.venue.findUnique({
                where: { id: venueId },
                select: { renterId: true },
            });

            if (venue && venue.renterId === user.id) {
                next();
            }
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (e) {
        next();
    }
};
export const isVenueOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const venueId = req.params.id;

        if (!user || user.role !== "RENTER") {
            res.status(403).json({
                message: "Forbidden: Requires Renter role",
            });
        }

        const venue = await prisma.venue.findUnique({
            where: { id: venueId },
            select: { renterId: true },
        });

        if (venue && user && venue.renterId === user.id) {
            next();
        }
    } catch (error) {
        next(error);
    }
};

export const canManageField = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const fieldId = req.params.id;

        if (!user) res.status(401).json({ message: "Not authenticated" });
        if (user.role === "ADMIN") next();
        else if (user.role === "RENTER") {
            const field = await prisma.field.findUnique({
                where: { id: fieldId },
                select: { venue: { select: { renterId: true } } },
            });

            if (field && field.venue.renterId === user.id) {
                next();
            }
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        next(error);
    }
};

export const renterOnlyMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    if (user && user.role === "RENTER") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Requires Renter role" });
    }
};
