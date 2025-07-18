import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

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

export class RejectVenueDto {
    @IsString()
    @IsNotEmpty()
    rejectionReason!: string;
}
