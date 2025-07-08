import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsUrl,
    IsUUID,
} from "class-validator";

export class CreateVenueDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    address!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsNotEmpty()
    renterId!: string;
}
