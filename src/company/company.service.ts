import { Injectable, Inject } from '@nestjs/common';
import { Company } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { COMPANY_REPOSITORY } from 'src/core/constants';

@Injectable()
export class CompanyService {
  private readonly company: any[];
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: typeof Company,
  ) {}

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.findAll<Company>({});
  }

  async create(company: CompanyDto, uid): Promise<Company> {
    return await this.companyRepository.create<Company>({ ...company, uid });
  }

  async findOne(id): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { id },
    });
  }

  async findByUid(uid): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { uid },
    });
  }

  async update(id, data, uid) {
    const [numberOfAffectedRows, [updatedCompany]] =
      await this.companyRepository.update(
        { ...data },
        { where: { id, uid }, returning: true },
      );

    return { numberOfAffectedRows, updatedCompany };
  }

  async admin_update(id, photo) {
    const [numberOfAffectedRows, [updatedCompany]] =
      await this.companyRepository.update(
        { photo },
        { where: { id }, returning: true },
      );

    return { numberOfAffectedRows, updatedCompany };
  }
}
