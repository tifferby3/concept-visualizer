import React, { useState } from 'react';

const DURATIONS = [
  { label: '1 min', value: 1 },
  { label: '3 min', value: 3 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handlePromptChange = (value: string) => setPrompt(value);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(Number(e.target.value));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setVideoUrl(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/video/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, duration }),
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/health/ping`
      );
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
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={prompt}
          onChange={(e: { target: { value: string; }; }) => handlePromptChange(e.target.value)}
          placeholder="Describe your concept..."
          style={{ width: 400, marginRight: 8 }}
          disabled={loading}
        />
        <select value={duration} onChange={handleDurationChange} disabled={loading} style={{ marginRight: 8 }}>
          {DURATIONS.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <button onClick={handleSubmit} disabled={loading || !prompt}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {videoUrl && (
        <div style={{ marginTop: 24 }}>
          <video src={videoUrl} controls width={600} />
          <div>
            <a href={videoUrl} download="concept-visualization.mp4">
              Download Video
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
