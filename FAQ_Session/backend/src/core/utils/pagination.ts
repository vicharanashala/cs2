import { PaginationQuery, PaginatedResult } from '../types/api.types';

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

export const parsePagination = (query: PaginationQuery): ParsedPagination => {
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '10', 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
