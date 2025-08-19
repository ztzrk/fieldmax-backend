import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateBookingDto {
    @IsUUID()
    @IsNotEmpty()
    fieldId!: string;

    @IsDateString()
    @IsNotEmpty()
    bookingDate!: string;

    @IsString()
    @IsNotEmpty()
    startTime!: string;
}
