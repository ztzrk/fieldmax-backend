import { IsString, IsOptional, IsUrl } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsUrl()
    @IsOptional()
    profilePictureUrl?: string;
}
