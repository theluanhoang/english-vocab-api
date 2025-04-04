import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionVocabulary } from './entities/collection-vocabulary.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, CollectionVocabulary]), UsersModule],
  providers: [CollectionsService],
  controllers: [CollectionsController],
  exports: [CollectionsService]
})
export class CollectionsModule {}
