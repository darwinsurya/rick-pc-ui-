import { useEffect, useState } from 'react';

interface Props {
  label: string;
  sub: string;
  reload?: boolean;
  onWake?: () => void;
}

export default function PowerOverlay({ label, sub, reload, onWake }: Props) {
  const [dots, setDots] = useState(0);
  const [showWake, setShowWake] = useState(false);

  useEffect(() => {
    const iv = window.setInterval(() => setDots((d) => (d + 1) % 4), 500);
    setShowWake(false);
    let wakeT: number | null = null;
    if (!reload) {
      wakeT = window.setTimeout(() => setShowWake(true), 2200);
    }
    if (reload) {
      const t = window.setTimeout(() => window.location.reload(), 2600);
      return () => {
        window.clearInterval(iv);
        window.clearTimeout(t);
      };
    }
    return () => {
      window.clearInterval(iv);
      if (wakeT) window.clearTimeout(wakeT);
    };
  }, [reload]);

  return (
    <div className="power-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="portal-loader" />
      <h1>{label}</h1>
      <p>{sub}</p>
      <div className="power-dots">
        {'.'.repeat(dots + 1).padEnd(3, ' ')}
      </div>
      {reload && <span className="dim">Restarting in a different dimension...</span>}
      {showWake && !reload && (
        <button className="power-wake" onClick={onWake}>
          <i className="fas fa-power-off" /> Wake the dimension back up
        </button>
      )}
    </div>
  );
}