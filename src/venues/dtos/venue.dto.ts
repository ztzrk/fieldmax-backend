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

    @IsUrl()
    @IsOptional()
    mainPhotoUrl?: string;

    @IsUUID()
    @IsNotEmpty()
    renterId!: string;
}

export class UpdateVenueDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    mainPhotoUrl?: string;

    @IsUUID()
    @IsOptional()
    renterId?: string;
}
