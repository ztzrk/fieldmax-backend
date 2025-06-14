import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.cookies["sessionId"];
        if (!sessionId) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            if (session) {
                await prisma.session.delete({ where: { id: sessionId } });
            }
            res.status(401).json({ message: "Session expired or invalid" });
            return;
        }

        req.user = session.user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};
