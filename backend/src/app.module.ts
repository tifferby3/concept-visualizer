import { Module } from '@nestjs/common';
import { LlmController, VideoController, HealthController } from './controllers';
import { LlmService, VideoService } from './services';
import { ScenesService } from './services/scenes.service';
import { PhysicsService } from './services/physics.service';
import { RenderingService } from './services/rendering.service';

@Module({
  controllers: [LlmController, VideoController, HealthController],
  providers: [LlmService, VideoService, ScenesService, PhysicsService, RenderingService],
})
export class AppModule {}
