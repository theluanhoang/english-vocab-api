import { Injectable } from '@nestjs/common';
import { QueryRunner, EntityManager } from 'typeorm';
import { Observable, defer, from, map } from 'rxjs';

@Injectable()
export class TransactionService<T> {
  private queryRunner: QueryRunner;

  constructor(
    private manager: EntityManager,
    private wrappedService: T,
  ) {
    this.queryRunner = this.manager.connection.createQueryRunner();
  }

  getService(): T {
    return this.wrappedService;
  }

  startTransaction(): Observable<QueryRunner> {
    return defer(() => {
      return this.queryRunner.connect().then(() => this.queryRunner.startTransaction());
    }).pipe(
      map(() => this.queryRunner),
    );
  }

  commitTransaction(queryRunner: QueryRunner): Observable<boolean> {
    return from(queryRunner.commitTransaction()).pipe(map(() => true));
  }

  rollbackTransaction(queryRunner: QueryRunner): Observable<boolean> {
    return from(queryRunner.rollbackTransaction()).pipe(map(() => true));
  }

  release(queryRunner: QueryRunner): Observable<boolean> {
    return from(queryRunner.release()).pipe(map(() => true));
  }
}