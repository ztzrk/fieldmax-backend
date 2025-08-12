import prisma from "../db";
import { CreateConversationDto } from "./dtos/chat.dto";
import { CreateMessageDto } from "./dtos/chat.dto";

export class ChatService {
    public async findOrCreateConversation(
        data: CreateConversationDto,
        userId: string
    ) {
        const field = await prisma.field.findUnique({
            where: { id: data.fieldId },
            select: { venue: { select: { renterId: true } } },
        });

        if (!field) {
            throw new Error("Field not found.");
        }
        const renterId = field.venue.renterId;

        const existingConversation = await prisma.conversation.findFirst({
            where: {
                fieldId: data.fieldId,
                userId: userId,
                renterId: renterId,
            },
        });

        if (existingConversation) {
            return existingConversation;
        }

        return prisma.conversation.create({
            data: {
                fieldId: data.fieldId,
                userId: userId,
                renterId: renterId,
            },
        });
    }

    public async createMessage(
        conversationId: string,
        data: CreateMessageDto,
        senderId: string
    ) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { userId: true, renterId: true },
        });

        if (!conversation) {
            throw new Error("Conversation not found.");
        }

        if (
            senderId !== conversation.userId &&
            senderId !== conversation.renterId
        ) {
            throw new Error(
                "Forbidden: You are not part of this conversation."
            );
        }

        return prisma.message.create({
            data: {
                conversationId,
                senderId,
                content: data.content,
            },
        });
    }
}
