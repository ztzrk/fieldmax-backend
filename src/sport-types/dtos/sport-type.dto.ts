import { IsString, IsNotEmpty } from "class-validator";

export class CreateSportTypeDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    iconName!: string;
}

export class UpdateSportTypeDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    iconName!: string;
}
