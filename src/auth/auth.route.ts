// src/auth/auth.route.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { authMiddleware } from "../middleware/auth.middleware";

export class AuthRoute {
    public path = "/auth";
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(RegisterUserDto),
            this.authController.register
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(LoginUserDto),
            this.authController.login
        );
        this.router.post(`${this.path}/logout`, this.authController.logout);
        this.router.get(
            `${this.path}/me`,
            authMiddleware,
            this.authController.getMe
        );
    }
}
