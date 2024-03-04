import { IsNotEmpty, MinLength } from 'class-validator';

export class CompanyDto {
  @IsNotEmpty()
  @MinLength(2)
  readonly company_name: string;

  @IsNotEmpty()
  @MinLength(2)
  readonly location: string;

  @IsNotEmpty()
  @MinLength(2)
  readonly no_of_staff: string;

  @IsNotEmpty()
  @MinLength(2)
  readonly uid: string;
}

export class UpdateCompanyDto {
  @IsNotEmpty()
  @MinLength(2)
  readonly company_name: string;

  @IsNotEmpty()
  @MinLength(2)
  readonly location: string;

  @IsNotEmpty()
  @MinLength(2)
  readonly no_of_staff: string;

  @MinLength(2)
  photo: string;
}

export class UpdateCompanyPhotoDto {
  @IsNotEmpty()
  photo: any;
}
