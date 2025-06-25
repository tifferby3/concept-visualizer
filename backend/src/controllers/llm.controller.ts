import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from '../services/llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate')
  async generate(@Body() body: { prompt: string; duration: number; mode?: string }) {
    // Log the incoming request for better traceability
    console.log('LLM generate request:', body);

    // Pass mode to LLM service for more advanced branching
    const result = await this.llmService.generateCode(body.prompt, body.duration, body.mode);

    // Log the generated code for debugging and improvement
    console.log('LLM generated code:', result.code);

    // Warn if fallback is used, but always return the code for transparency
    if (
      result.code.includes('LLM code missing render or scene.add, using fallback.') ||
      result.code.includes('Fallback:')
    ) {
      console.warn('LLM code missing render or scene.add, using fallback.');
    }
    return result;
  }

  @Post('reinforce')
  async reinforce(@Body() body: { prompt: string; expectedCode: string }) {
    return this.llmService.reinforce(body);
  }
}
