import React, { useState } from 'react';
import PromptInput from './components/PromptInput';
import DurationSelect from './components/DurationSelect';
import ModeSelect from './components/ModeSelect';
import VideoPreview from './components/VideoPreview';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<number>(1);
  const [mode, setMode] = useState<string>('basic');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setVideoUrl(null);
    try {
      // Fix: Use (import.meta as any).env for Vite env vars
      const apiUrl =
        (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/video/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, duration, mode }),
        }
      );
      if (!response.ok) throw new Error('Video generation failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (e) {
      alert('Failed to generate video');
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    setPingResult('Testing...');
    try {
      const apiUrl =
        (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/health/ping`);
      const data = await res.json();
      setPingResult(data.message || 'No response');
    } catch (e) {
      setPingResult('Failed to connect');
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Concept Visualizer</h1>
      <button onClick={testBackend} style={{ marginBottom: 16 }}>
        Test Backend Connection
      </button>
      {pingResult && (
        <div style={{ marginBottom: 16 }}>Backend says: {pingResult}</div>
      )}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          disabled={loading}
        />
        <DurationSelect
          duration={duration}
          setDuration={setDuration}
          disabled={loading}
        />
        <ModeSelect
          mode={mode}
          setMode={setMode}
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading || !prompt}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {loading && <div>Loading...</div>}
      <VideoPreview videoUrl={videoUrl} />
    </div>
  );
};

export default App;

