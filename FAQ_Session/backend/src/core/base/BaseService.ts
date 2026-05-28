import { logger } from '../utils/logger';

export abstract class BaseService {
  protected readonly logger = logger;
}
