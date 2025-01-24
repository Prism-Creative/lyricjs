import { DynamicModule, Module, Provider } from '@nestjs/common';
import { LyricClient } from './lyric-client';
import { LyricConfig } from './types';
import { LyricService } from './lyric.service';

export const LYRIC_CONFIG = 'LYRIC_CONFIG';

export interface LyricModuleAsyncOptions {
  useFactory: (...args: any[]) => Promise<LyricConfig> | LyricConfig;
  inject?: any[];
  imports?: any[];
}

@Module({})
export class LyricModule {
  static forRoot(config: LyricConfig): DynamicModule {
    const clientProvider: Provider = {
      provide: LyricClient,
      useFactory: () => new LyricClient(config),
    };

    return {
      module: LyricModule,
      providers: [
        {
          provide: LYRIC_CONFIG,
          useValue: config,
        },
        clientProvider,
        LyricService,
      ],
      exports: [LyricService],
      global: true,
    };
  }

  static forRootAsync(options: LyricModuleAsyncOptions): DynamicModule {
    const asyncConfigProvider: Provider = {
      provide: LYRIC_CONFIG,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const clientProvider: Provider = {
      provide: LyricClient,
      useFactory: (config: LyricConfig) => new LyricClient(config),
      inject: [LYRIC_CONFIG],
    };

    return {
      module: LyricModule,
      imports: options.imports || [],
      providers: [asyncConfigProvider, clientProvider, LyricService],
      exports: [LyricService],
      global: true,
    };
  }
}
