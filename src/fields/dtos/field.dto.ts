import { Type } from "class-transformer";
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    IsNumber,
    Min,
    Max,
    ValidateNested,
    IsArray,
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

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScheduleDto)
    @IsOptional()
    schedules?: ScheduleDto[];
}

export class UpdateFieldDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsUUID()
    @IsOptional()
    sportTypeId?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    pricePerHour?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScheduleDto)
    @IsOptional()
    schedules?: ScheduleDto[];
}
