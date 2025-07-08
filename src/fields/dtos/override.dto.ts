import { Type } from "class-transformer";
import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
} from "class-validator";

export class ScheduleOverrideDto {
    @IsDateString()
    @IsNotEmpty()
    overrideDate!: string;

    @IsBoolean()
    @IsNotEmpty()
    isClosed!: boolean;

    @ValidateIf((o) => o.isClosed === false)
    @IsString()
    @IsNotEmpty()
    openTime?: string;

    @ValidateIf((o) => o.isClosed === false)
    @IsString()
    @IsNotEmpty()
    closeTime?: string;
}
