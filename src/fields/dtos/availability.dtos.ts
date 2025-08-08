import { IsDateString, IsNotEmpty } from "class-validator";

export class GetAvailabilityDto {
    @IsDateString()
    @IsNotEmpty()
    date!: string;
}
