import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateSportTypeDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    iconName?: string;
}
