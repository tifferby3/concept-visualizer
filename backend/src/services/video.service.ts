import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as puppeteer from 'puppeteer';
import { LlmService } from './llm.service';

@Injectable()
export class VideoService {
  constructor(private readonly llmService: LlmService) {}

  async generateVideo(prompt: string, duration: number): Promise<string> {
    const videoPath = '/tmp/generated.mp4';
    const framesDir = '/tmp/frames';
    const width = 640;
    const height = 480;
    const fps = 30;
    const frameCount = Math.max(duration * 60, 1) * fps; // duration in minutes, ensure at least 1 frame

    // Clean up previous files
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
    fs.mkdirSync(framesDir);

    // 1. Get code from LLM (pass duration for context)
    const { code } = await this.llmService.generateCode(prompt, duration);

    // 2. Launch Puppeteer and render frames
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width, height });

    // 3. Prepare HTML with three.js and injected code
    const html = `
      <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"></script>
      </head>
      <body style="margin:0;overflow:hidden;background:#000;">
        <script>
          ${code}
        </script>
      </body>
      </html>
    `;
    await page.setContent(html);

    // 4. Render and capture frames
    for (let frame = 0; frame < frameCount; frame++) {
      await page.evaluate((f) => {
        // @ts-ignore
        window.renderFrame && window.renderFrame(f);
      }, frame);
      const framePath = path.join(framesDir, `frame_${String(frame).padStart(6, '0')}.png`);
      await page.screenshot({ path: framePath as `${string}.png` });
    }
    await browser.close();

    // 5. Use ffmpeg to assemble frames into a video
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(path.join(framesDir, 'frame_%06d.png'))
        .inputFPS(fps)
        .outputOptions('-pix_fmt yuv420p')
        .outputOptions('-r ' + fps)
        .duration(frameCount / fps)
        .save(videoPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    // 6. Clean up frames
    fs.rmSync(framesDir, { recursive: true, force: true });

    return videoPath;
  }
}