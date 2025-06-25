import React from 'react';

const MODES = [
  { label: 'Basic (three.js)', value: 'basic' },
  { label: 'Advanced (babylon.js)', value: 'advanced' },
  { label: 'Pro (three.js + postprocessing + gsap + troika)', value: 'pro' },
];

interface Props {
  mode: string;
  setMode: (v: string) => void;
  disabled?: boolean;
}

const ModeSelect: React.FC<Props> = ({ mode, setMode, disabled }) => (
  <select
    value={mode}
    onChange={e => setMode(e.target.value)}
    disabled={disabled}
  >
    {MODES.map(m => (
      <option key={m.value} value={m.value}>{m.label}</option>
    ))}
  </select>
);

export default ModeSelect;
