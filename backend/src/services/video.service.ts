import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as puppeteer from 'puppeteer';
import { LlmService } from './llm.service';
import { PhysicsService } from './physics.service';
import { ScenesService } from './scenes.service';
import { RenderingService } from './rendering.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly llmService: LlmService,
    private readonly physicsService: PhysicsService,
    private readonly scenesService: ScenesService,
    private readonly renderingService: RenderingService
  ) {}

  async generateVideo(prompt: string, duration: number, mode?: string): Promise<string> {
    const videoPath = '/tmp/generated.mp4';
    const framesDir = '/tmp/frames';
    const width = 640;
    const height = 480;
    const fps = 30;
    const frameCount = Math.max(duration * 60, 1) * fps;

    // Clean up previous files
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
    fs.mkdirSync(framesDir);

    // 1. Generate code using LLM
    const physicsContext = this.physicsService.getLLMPhysicsSummary();
    const { code } = await this.llmService.generateCode(
      `${prompt}\n\nPhysics context:\n${physicsContext}`,
      duration,
      mode
    );

    // 2. Validate and store the scene code
    const sceneId = `scene_${Date.now()}`;
    if (!this.scenesService.validateSceneCode(code)) {
      throw new Error('[VideoService] Generated scene code is invalid. Please check LLM output.');
    }
    this.scenesService.saveScene(sceneId, code);

    // 3. Use RenderingService to render frames and collect them into a video
    await this.renderingService.renderToVideo({
      code,
      videoPath,
      framesDir,
      width,
      height,
      fps,
      frameCount
    });

    return videoPath;
  }
}