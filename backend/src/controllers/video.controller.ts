import { Controller, Post, Body, Res } from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { Response } from 'express';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('generate')
  async generate(@Body() body: { prompt: string; duration: number }, @Res() res: Response) {
    const videoPath = await this.videoService.generateVideo(body.prompt, body.duration);
    res.download(videoPath);
  }
}

