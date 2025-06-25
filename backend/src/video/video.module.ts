import { Module } from '@nestjs/common';
import { VideoController } from '../controllers/video.controller';
import { VideoService } from '../services/video.service';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
