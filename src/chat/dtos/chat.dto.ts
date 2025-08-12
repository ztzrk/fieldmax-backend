import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateConversationDto {
    @IsUUID()
    @IsNotEmpty()
    fieldId!: string;
}

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    content!: string;
}
