import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class CreateFieldDto {
    @IsString()
    @IsNotEmpty()
    fieldName!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    venueId!: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    sportTypeId!: string;

    @IsNumber()
    @IsNotEmpty()
    pricePerHour!: number;
}
