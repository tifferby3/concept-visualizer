import React from 'react';

interface Props {
  prompt: string;
  setPrompt: (v: string) => void;
  disabled?: boolean;
}

const PromptInput: React.FC<Props> = ({ prompt, setPrompt, disabled }) => (
  <input
    type="text"
    value={prompt}
    onChange={e => setPrompt(e.target.value)}
    placeholder="Describe your concept..."
    style={{ width: 300 }}
    disabled={disabled}
  />
);

export default PromptInput;
