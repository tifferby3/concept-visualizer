import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ping')
  ping() {
    return { message: 'pong' };
  }

  @Post('generate')
  generate(@Body() body: { prompt: string }) {
    // Placeholder: Replace with LLM integration
    const code = `// Generated code for: ${body.prompt}\nconsole.log('Hello, 3D World!');`;
    return { code };
  }
}
