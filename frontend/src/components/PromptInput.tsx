import React from 'react';

interface PromptInputProps {
  prompt: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, onChange, onSubmit, loading }) => (
  <div style={{ marginBottom: 16 }}>
    <input
      type="text"
      value={prompt}
      onChange={e => onChange(e.target.value)}
      placeholder="Describe your concept..."
      style={{ width: 400, marginRight: 8 }}
      disabled={loading}
    />
    <button onClick={onSubmit} disabled={loading || !prompt}>
      {loading ? 'Generating...' : 'Generate'}
    </button>
  </div>
);

export default PromptInput;
