import { Module } from '@nestjs/common';
import { LlmController } from '../controllers/llm.controller';
import { LlmService } from '../services/llm.service';
import { PhysicsService } from '../services/physics.service';
import { MathematicsService } from '../services/mathematics.service';
import { ShapesService } from '../services/shapes.service';

@Module({
  controllers: [LlmController],
  providers: [LlmService, PhysicsService, MathematicsService, ShapesService],
  exports: [LlmService, PhysicsService, MathematicsService, ShapesService],
})
export class LlmModule {}

// The LlmModule :
// - It provides LlmService for DI in other modules.
// - It registers LlmController for LLM endpoints.
// - It exports LlmService for use in other modules (e.g., VideoService).
// No further changes needed unless you want to add imports for shared modules or configuration.
