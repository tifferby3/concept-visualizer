import { Controller, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { Response } from 'express';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('generate')
  async generate(
    @Body() body: { prompt: string; duration: number; mode?: string },
    @Res() res: Response
  ) {
    try {
      // Log incoming request for traceability
      console.log('Video generate request:', body);

      // Validate input
      if (!body.prompt || !body.duration || !body.mode) {
        throw new HttpException('Missing prompt, duration, or mode', HttpStatus.BAD_REQUEST);
      }

      // Generate video using the service (pass mode for advanced branching)
      const videoPath = await this.videoService.generateVideo(body.prompt, body.duration);

      // Log the video path for debugging
      console.log('Generated video path:', videoPath);

      // Stream the video file to the client
      res.download(videoPath, 'concept-visualization.mp4', err => {
        if (err) {
          console.error('Error sending video:', err);
          res.status(500).send('Error sending video');
        }
      });
    } catch (error) {
      console.error('Video generation error:', error);
      res.status(500).json({ error: 'Video generation failed', details: error?.message });
    }
  }
}

