import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from '../services/llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate')
  async generate(@Body() body: { prompt: string; duration: number }) {
    return this.llmService.generateCode(body.prompt, body.duration);
  }

  @Post('reinforce')
  async reinforce(@Body() body: { prompt: string; expectedCode: string }) {
    return this.llmService.reinforce(body);
  }
}
