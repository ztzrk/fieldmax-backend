import { NextFunction, Request, Response } from "express";
import { ChatService } from "./chat.service";
import { CreateConversationDto, CreateMessageDto } from "./dtos/chat.dto";

export class ChatController {
    public service = new ChatService();

    public getOrCreateConversation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data: CreateConversationDto = req.body;
            const userId = req.user!.id;
            const conversation = await this.service.findOrCreateConversation(
                data,
                userId
            );
            res.status(200).json({ data: conversation });
        } catch (error) {
            next(error);
        }
    };

    public sendMessage = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { conversationId } = req.params;
            const data: CreateMessageDto = req.body;
            const senderId = req.user!.id;
            const message = await this.service.createMessage(
                conversationId,
                data,
                senderId
            );
            res.status(201).json({ data: message });
        } catch (error) {
            next(error);
        }
    };
}
