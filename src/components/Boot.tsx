import { useEffect, useState } from 'react';
import { rickQuote } from '../os/quotes';

const LINES = [
  'Spawning clones... (again)',
  'Watering the garage',
  'Looking for a Jerry',
  'Balancing council quotas',
  'Locating portal fluid',
  'Teaching snakes how to jazz',
  'Downloading wubba lubba',
  'Recovering szechuan sauce (mission ARGENTINA)',
  'Sealing up swallowed universes',
  'Appreciating we-as-a-duo',
];

export default function Boot() {
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [quote] = useState(() => rickQuote());

  useEffect(() => {
    let p = 0;
    const iv = window.setInterval(() => {
      p = Math.min(100, p + Math.random() * 14 + 4);
      setProgress(p);
    }, 160);
    const iv2 = window.setInterval(() => {
      setLineIdx((i) => i + 1);
    }, 560);
    return () => {
      window.clearInterval(iv);
      window.clearInterval(iv2);
    };
  }, []);

  const line = LINES[Math.min(lineIdx, LINES.length - 1)];

  return (
    <div className="boot-screen">
      <div className="boot-content">
        <div className="portal-loader" />
        <h1 className="boot-brand">CITADEL&nbsp;OS</h1>
        <p className="boot-tag">powered by the Council of Ricks</p>
        <p className="boot-sub">“{quote}”</p>
        <div className="boot-progress">
          <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="boot-line">{line}</p>
      </div>
    </div>
  );
}