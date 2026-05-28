import { Types } from 'mongoose';
import { BaseService } from '../../core/base/BaseService';
import { QueryRepository } from './query.repository';
import { IQuery, QueryStatus } from './query.interface';
import { NotFoundError } from '../../core/errors';
import { Messages } from '../../core/constants/messages';
import { parsePagination, buildPaginatedResult } from '../../core/utils/pagination';
import { PaginatedResult } from '../../core/types/api.types';
import { CreateQueryDtoType } from './query.dto';

export interface QueryPaginationQuery {
  page?: string;
  limit?: string;
  status?: QueryStatus;
}

export class QueryService extends BaseService {
  constructor(private readonly queryRepo: QueryRepository) {
    super();
  }

  async getQueries(query: QueryPaginationQuery): Promise<PaginatedResult<IQuery>> {
    const { page, limit, skip } = parsePagination(query);
    const [queries, total] = await Promise.all([
      this.queryRepo.findPaginated(skip, limit, query.status),
      this.queryRepo.countByStatus(query.status),
    ]);
    return buildPaginatedResult(queries, total, page, limit);
  }

  async getQueryById(id: string): Promise<IQuery> {
    const query = await this.queryRepo.findById(id);
    if (!query) throw new NotFoundError(Messages.QUERY_NOT_FOUND);
    return query;
  }

  async createQuery(dto: CreateQueryDtoType, userId?: Types.ObjectId): Promise<IQuery> {
    return this.queryRepo.create({
      title: dto.title,
      description: dto.description,
      createdBy: userId ?? null,
      status: 'pending',
    });
  }

  async deleteQuery(id: string): Promise<void> {
    const query = await this.queryRepo.findById(id);
    if (!query) throw new NotFoundError(Messages.QUERY_NOT_FOUND);
    await this.queryRepo.deleteById(id);
  }
}
