import { DeepPartial, Repository, QueryRunner, UpdateResult, ObjectLiteral } from 'typeorm';
import { Observable, defer } from 'rxjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  saveInTransaction(entity: DeepPartial<T>, queryRunner: QueryRunner): Observable<T> {
    return defer(() => queryRunner.manager.getRepository(this.repository.target).save(entity));
  }

  updateInTransaction(id: any, entity: QueryDeepPartialEntity<T>, queryRunner: QueryRunner): Observable<UpdateResult> {
    return defer(() => queryRunner.manager.getRepository(this.repository.target).update(id, entity));
  }

  removeInTransaction(entity: T, queryRunner: QueryRunner): Observable<any> {
    return defer(() => queryRunner.manager.getRepository(this.repository.target).remove(entity));
  }
}