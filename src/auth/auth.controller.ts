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
            const { tokenData, user } = await this.authService.login(userData);

            res.setHeader("Set-Cookie", [
                `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`,
            ]);

            res.status(200).json({
                data: { user, tokenData },
                message: "Login successful",
            });
        } catch (error) {
            next(error);
        }
    };
}
