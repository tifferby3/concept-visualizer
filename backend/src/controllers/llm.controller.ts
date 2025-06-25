import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from '../services/llm.service';
import { LlmOrchestrationService } from '../services/llm-orchestration.service';

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly orchestration: LlmOrchestrationService // Inject orchestration service
  ) {}

  @Post('generate')
  async generate(@Body() body: { prompt: string; duration: number; mode?: string }) {
    // Use orchestration service for the full pipeline
    const result = await this.orchestration.generateVisualization(body.prompt, body.duration, body.mode);
    console.log('LLM orchestration generated code:', result.code);
    return result;
  }

  @Post('reinforce')
  async reinforce(@Body() body: { prompt: string; expectedCode: string }) {
    return this.llmService.reinforce(body);
  }
}
