import React from 'react';

interface Props {
  videoUrl: string | null;
}

const VideoPreview: React.FC<Props> = ({ videoUrl }) =>
  videoUrl ? (
    <div style={{ marginTop: 24 }}>
      <video src={videoUrl} controls width={600} />
      <div>
        <a href={videoUrl} download="concept-visualization.mp4">
          Download Video
        </a>
      </div>
    </div>
  ) : null;

export default VideoPreview;
