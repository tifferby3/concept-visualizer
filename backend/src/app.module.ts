import { Module } from '@nestjs/common';
import { LlmController, VideoController, HealthController } from './controllers';
import { LlmService, VideoService } from './services';
import { ScenesService } from './services/scenes.service';
import { PhysicsService } from './services/physics.service';
import { RenderingService } from './services/rendering.service';
import { MathematicsService } from './services/mathematics.service';
import { ShapesService } from './services/shapes.service';
import { LlmOrchestrationService } from './services/llm-orchestration.service';

@Module({
  controllers: [LlmController, VideoController, HealthController],
  providers: [
    LlmService,
    VideoService,
    ScenesService,
    PhysicsService,
    RenderingService,
    MathematicsService,
    ShapesService,
    LlmOrchestrationService,
  ],
})
export class AppModule {}
