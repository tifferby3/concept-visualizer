import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from '../services/llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate')
  async generate(@Body() body: { prompt: string; duration: number }) {
    const result = await this.llmService.generateCode(body.prompt, body.duration);
    if (result.code.includes('LLM code missing render or scene.add, using fallback.')) {
      console.warn('LLM code missing render or scene.add, using fallback.');
    }
    return result;
  }

  @Post('reinforce')
  async reinforce(@Body() body: { prompt: string; expectedCode: string }) {
    return this.llmService.reinforce(body);
  }
}
