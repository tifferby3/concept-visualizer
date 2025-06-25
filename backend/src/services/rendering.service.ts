import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as puppeteer from 'puppeteer';

interface RenderToVideoOptions {
  code: string;
  videoPath: string;
  framesDir: string;
  width: number;
  height: number;
  fps: number;
  frameCount: number;
}

@Injectable()
export class RenderingService {
  async renderToVideo(options: RenderToVideoOptions): Promise<void> {
    const { code, videoPath, framesDir, width, height, fps, frameCount } = options;

    // Clean up previous files
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
    fs.mkdirSync(framesDir);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width, height });

    // Prepare HTML with all required libraries and injected code
    const html = `
      <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/ccapture.js@1.1.0/build/CCapture.all.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/troika-three-text@0.47.0/dist/troika-three-text.umd.min.js"></script>
        <script src="https://cdn.babylonjs.com/babylon.js"></script>
      </head>
      <body style="margin:0;overflow:hidden;background:#000;">
        <script>
          window.addEventListener('DOMContentLoaded', function() {
            try {
              ${code}
            } catch (err) {
              document.body.innerHTML = '<pre style="color:red;">Render error: ' + err + '</pre>';
              window.__sceneRenderError = err && err.toString();
            }
          });
        </script>
      </body>
      </html>
    `;
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Render and capture frames, with error detection
    let renderError = null;
    for (let frame = 0; frame < frameCount; frame++) {
      await page.evaluate((f) => {
        // @ts-ignore
        window.renderFrame && window.renderFrame(f);
      }, frame);
      renderError = await page.evaluate(() => (window as any).__sceneRenderError || null);
      if (renderError) {
        await browser.close();
        throw new Error(`[RenderingService] Error during scene rendering: ${renderError}`);
      }
      const framePath = path.join(framesDir, `frame_${String(frame).padStart(6, '0')}.png`);
      await page.screenshot({ path: framePath as `${string}.png` });
    }
    await browser.close();

    // Use ffmpeg to assemble frames into a video
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

    // Clean up frames
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
}
