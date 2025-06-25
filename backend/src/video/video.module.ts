import { Module } from '@nestjs/common';
import { VideoController } from '../controllers/video.controller';
import { VideoService } from '../services/video.service';
import { LlmModule } from '../llm/llm.module';
import { PhysicsService } from '../services/physics.service';

@Module({
  imports: [LlmModule],
  controllers: [VideoController],
  providers: [VideoService, PhysicsService],
  exports: [VideoService, PhysicsService],
})
export class VideoModule {}
// - Imports LlmModule for LLM integration
// - Registers VideoController and VideoService
// - Exports VideoService for use in other modules if needed
// No further changes needed unless you want to add shared modules or configuration.
