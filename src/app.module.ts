import { Module } from '@nestjs/common';
import { VocabularyModule } from 'src/modules/vocabulary/vocabulary.module';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CollectionsModule } from './modules/collections/collections.module';
import { GeminiModule } from './modules/gemini/gemini.module';
import { TtsModule } from './modules/tts/tts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30 * 24 * 60 * 60,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    VocabularyModule, UsersModule, AuthModule, CollectionsModule, GeminiModule, TtsModule
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule { }
