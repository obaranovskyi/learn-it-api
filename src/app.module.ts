import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { UserModule } from './user/user.module';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { WorkspaceModule } from './workspace/workspace.module';
import { WordModule } from './word/word.module';
import { StatsModule } from './stats/stats.module';
import { ORM_CONFIG } from '../ormconfig'


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ headers: req.headers }),
      cors: {
        origin: '*',
        credentials: true
      }
    }),
    TypeOrmModule.forRoot({
      ...ORM_CONFIG,
      autoLoadEntities: true
    }
    ),
    UserModule,
    WorkspaceModule,
    WordModule,
    StatsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ]
})
export class AppModule { }
