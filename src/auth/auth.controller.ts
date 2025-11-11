// src/auth/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";

export class AuthController {
    public authService = new AuthService();

    public register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userData: RegisterUserDto = req.body;
            const newUser = await this.authService.register(userData);

            res.status(201).json({
                data: newUser,
                message: "User created successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    public login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userData: LoginUserDto = req.body;
            const { sessionId, user } = await this.authService.login(userData);

            const expiresIn = 24 * 60 * 60;
            res.setHeader("Set-Cookie", [
                `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${expiresIn}; SameSite=Lax`,
            ]);

            res.status(200).json({
                data: { user },
                message: "Login successful",
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Password not matching"
            ) {
                res.status(401).json({ message: error.message });
            } else {
                next(error);
            }
        }
    };

    public logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const sessionId = req.cookies["sessionId"];
            if (sessionId) {
                await this.authService.logout(sessionId);
            }

            res.setHeader(
                "Set-Cookie",
                "sessionId=; HttpOnly; Path=/; Max-Age=0"
            );
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            next(error);
        }
    };

    public getMe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userFromMiddleware = req.user;

            if (!userFromMiddleware) {
                res.status(401).json({
                    message: "Not authenticated or user not found",
                });
                return;
            }

            const { password, ...userWithoutPassword } = userFromMiddleware;

            res.status(200).json({
                data: userWithoutPassword,
                message: "success",
            });
        } catch (error) {
            next(error);
        }
    };
}
