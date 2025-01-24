import { DynamicModule, Module, Provider } from '@nestjs/common';
import { LyricClient } from './lyric-client';
import { LyricConfig } from './types';

export const LYRIC_CONFIG = 'LYRIC_CONFIG';

@Module({})
export class LyricModule {
  static forRoot(config: LyricConfig): DynamicModule {
    const configProvider: Provider = {
      provide: LYRIC_CONFIG,
      useValue: config,
    };

    const clientProvider: Provider = {
      provide: LyricClient,
      useFactory: (config: LyricConfig) => new LyricClient(config),
      inject: [LYRIC_CONFIG],
    };

    return {
      module: LyricModule,
      providers: [configProvider, clientProvider],
      exports: [LyricClient],
      global: true,
    };
  }
}
