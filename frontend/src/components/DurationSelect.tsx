import React from 'react';

const DURATIONS = [
  { label: '1 min', value: 1 },
  { label: '3 min', value: 3 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
];

interface Props {
  duration: number;
  setDuration: (v: number) => void;
  disabled?: boolean;
}

const DurationSelect: React.FC<Props> = ({ duration, setDuration, disabled }) => (
  <select
    value={duration}
    onChange={e => setDuration(Number(e.target.value))}
    disabled={disabled}
  >
    {DURATIONS.map(d => (
      <option key={d.value} value={d.value}>{d.label}</option>
    ))}
  </select>
);

export default DurationSelect;
