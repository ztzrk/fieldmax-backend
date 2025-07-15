import { Type } from "class-transformer";
import {
    IsArray,
    IsOptional,
    IsUUID,
    IsNumber,
    IsString,
    IsNotEmpty,
    Min,
    ValidateNested,
    Max,
} from "class-validator";

class ScheduleDto {
    @IsNumber()
    @Min(1)
    @Max(7)
    dayOfWeek!: number;

    @IsString()
    @IsNotEmpty()
    openTime!: string;

    @IsString()
    @IsNotEmpty()
    closeTime!: string;
}

export class CreateFieldDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsUUID()
    @IsNotEmpty()
    venueId!: string;

    @IsUUID()
    @IsNotEmpty()
    sportTypeId!: string;

    @IsNumber()
    @Min(0)
    pricePerHour!: number;

    @IsString()
    @IsOptional()
    description?: string;
}
