// src/users/users.route.ts
import { Router, Response, NextFunction, Request } from "express";
import { UsersController } from "./users.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { UpdateUserDto } from "./dtos/user.dto";
import { RegisterUserDto } from "../auth/dtos/register-user.dto";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { PaginationDto } from "../dtos/pagination.dto";

export class UsersRoute {
    public path = "/users";
    public router = Router();
    public usersController = new UsersController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(this.path, authMiddleware, adminOnlyMiddleware);

        this.router.post(
            `${this.path}`,
            validationMiddleware(RegisterUserDto),
            this.usersController.createUser
        );

        this.router.get(
            `${this.path}`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(PaginationDto, true, true),
            this.usersController.getUsers
        );

        this.router.get(`${this.path}/:id`, this.usersController.getUserById);

        this.router.put(
            `${this.path}/:id`,
            validationMiddleware(UpdateUserDto),
            this.usersController.updateUser
        );

        this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);

        this.router.post(
            `${this.path}/multiple`,
            this.usersController.deleteMultipleUsers
        );
    }
}
