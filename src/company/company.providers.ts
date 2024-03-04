import { Company } from './company.entity';
import { COMPANY_REPOSITORY } from '../core/constants';

export const companyProviders = [
  {
    provide: COMPANY_REPOSITORY,
    useValue: Company,
  },
];
