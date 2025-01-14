import { PaginationResult } from '../../../shared/components/pagination/types/pagination-result.type';

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export type PaginatedUsers = PaginationResult<AdminUser>;

export type EmailMessage = {
  title: string;
  content: string;
}
