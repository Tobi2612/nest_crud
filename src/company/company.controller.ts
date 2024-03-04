import {
  Controller,
  Get,
  UseGuards,
  Post,
  Put,
  Param,
  Body,
  NotFoundException,
  Request,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { CompanyService } from './company.service';
import { Company as CompanyEntity } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { UsersService } from 'src/modules/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async findAll(@Request() req) {
    const user = await this.userService.findOneByUid(req.user.uid);
    if (user.user_type !== 'admin') {
      throw new NotFoundException('You are not allowed to perform this action');
    }
    return await this.companyService.findAll();
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async findOne(@Param('id') id: number): Promise<CompanyEntity> {
    const company = await this.companyService.findOne(id);

    if (!company) {
      throw new NotFoundException("This Company doesn't exist");
    }
    return company;
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(
    @Body() company: CompanyDto,
    @Request() req,
  ): Promise<CompanyEntity> {
    const company_exists = await this.companyService.findByUid(req.user.uid);
    if (company_exists) {
      throw new NotFoundException(
        'You already have a company with id: ' + company_exists.id,
      );
    }
    return await this.companyService.create(company, req.user.uid);
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() company: CompanyDto,
    @Request() req,
  ): Promise<CompanyEntity> {
    const { numberOfAffectedRows, updatedCompany } =
      await this.companyService.update(id, company, req.user.uid);

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Company doesn't exist");
    }

    return updatedCompany;
  }

  @Put('/photo/:id')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async update_photo(
    @Param('id') id: number,
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpg',
        })
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ): Promise<CompanyEntity> {
    const user = await this.userService.findOneByUid(req.user.uid);
    if (user.user_type !== 'admin') {
      throw new NotFoundException('You are not allowed to perform this action');
    }
    const { numberOfAffectedRows, updatedCompany } =
      await this.companyService.admin_update(id, file.path);

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Company doesn't exist");
    }

    return updatedCompany;
  }
}
