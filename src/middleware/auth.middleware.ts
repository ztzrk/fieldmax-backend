// src/middleware/auth.middleware.ts
import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { DataStoredInToken } from "../auth/auth.service";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Authentication token missing" });
            return;
        }

        const secretKey: string = process.env.JWT_SECRET || "supersecret";
        const verificationResponse = jwt.verify(
            token,
            secretKey
        ) as DataStoredInToken;
        const userId = verificationResponse.id;

        const prisma = new PrismaClient();
        const findUser: User | null = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (findUser) {
            req.user = findUser;
            next();
        } else {
            res.status(401).json({ message: "Wrong authentication token" });
        }
    } catch (error) {
        res.status(401).json({ message: "Wrong authentication token" });
    }
};
