import { Module } from '@nestjs/common';
import { LlmController, VideoController, HealthController } from './controllers';
import { LlmService, VideoService } from './services';

@Module({
  controllers: [LlmController, VideoController, HealthController],
  providers: [LlmService, VideoService],
})
export class AppModule {}
