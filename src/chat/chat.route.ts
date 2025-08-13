import { Router } from "express";
import { ChatController } from "./chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { CreateConversationDto, CreateMessageDto } from "./dtos/chat.dto";

export class ChatRoute {
    public path = "/conversations";
    public router = Router();
    public controller = new ChatController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            authMiddleware,
            validationMiddleware(CreateConversationDto),
            this.controller.getOrCreateConversation
        );

        this.router.post(
            `${this.path}/:conversationId/messages`,
            authMiddleware,
            validationMiddleware(CreateMessageDto),
            this.controller.sendMessage
        );
    }
}
