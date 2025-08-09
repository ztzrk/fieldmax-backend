// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export const validationMiddleware = (
    type: any,
    skipMissingProperties = false,
    validateQuery = false
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToInstance(type, req.body);
        validate(dto, { skipMissingProperties }).then(
            (errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors
                        .map((error: ValidationError) =>
                            Object.values(error.constraints || {})
                        )
                        .join(", ");
                    res.status(400).json({ message });
                } else {
                    req.body = dto;
                    next();
                }
            }
        );
    };
};
