import { Module } from '@nestjs/common';
import { LlmController } from '../controllers/llm.controller';
import { LlmService } from '../services/llm.service';

@Module({
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
