import { Model, Document, UpdateQuery } from 'mongoose';
import { DatabaseError } from '../errors';

// Mongoose 9 uses QueryFilter instead of FilterQuery
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Filter<T> = Record<string, any> | Partial<T>;

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (err) {
      throw new DatabaseError(`Failed to find by id: ${(err as Error).message}`);
    }
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (err) {
      throw new DatabaseError(`Failed to findOne: ${(err as Error).message}`);
    }
  }

  async find(filter: Filter<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter).exec();
    } catch (err) {
      throw new DatabaseError(`Failed to find: ${(err as Error).message}`);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (err) {
      throw new DatabaseError(`Failed to create: ${(err as Error).message}`);
    }
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    } catch (err) {
      throw new DatabaseError(`Failed to update: ${(err as Error).message}`);
    }
  }

  async deleteById(id: string): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (err) {
      throw new DatabaseError(`Failed to delete: ${(err as Error).message}`);
    }
  }

  async countDocuments(filter: Filter<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (err) {
      throw new DatabaseError(`Failed to count: ${(err as Error).message}`);
    }
  }
}
