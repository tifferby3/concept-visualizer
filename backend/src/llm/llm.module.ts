import { Module } from '@nestjs/common';
import { LlmController } from '../controllers/llm.controller';
import { LlmService } from '../services/llm.service';

@Module({
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}

// The LlmModule is correctly structured:
// - It provides LlmService for DI in other modules.
// - It registers LlmController for LLM endpoints.
// - It exports LlmService for use in other modules (e.g., VideoService).
// No further changes needed unless you want to add imports for shared modules or configuration.
