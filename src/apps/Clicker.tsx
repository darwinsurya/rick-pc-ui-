import { useState } from 'react';
import { Sound } from '../os/sound';
import { rickQuote } from '../os/quotes';
import { confetti } from '../components/fx';
import type { AppProps } from '../os/types';

export default function Clicker({ windowId }: AppProps) {
  const [c, setC] = useState(0);
  void windowId;

  const click = () => {
    Sound.click();
    setC((n) => {
      const next = n + 1;
      if (next > 0 && next % 100 === 0) confetti();
      return next;
    });
  };

  const danger = c >= 100;

  return (
    <div className="clicker">
      <div className="clicker-display">
        <b>{c.toLocaleString()}</b>
        <span>{danger ? 'You clicked past the point of no return.' : 'farts clicked'}</span>
      </div>
      <div
        className={`clicker-btn ${danger ? 'danger' : ''}`}
        onClick={click}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') click();
        }}
      >
        {danger ? 'STOP. JUST STOP.' : 'CLICK ME'}
      </div>
      <div className="clicker-achievements">
        <span className={c >= 10 ? 'unlocked' : ''}>10 clicks</span>
        <span className={c >= 50 ? 'unlocked' : ''}>50 clicks</span>
        <span className={c >= 100 ? 'unlocked' : ''}>100 clicks (why?)</span>
        <span className={c >= 500 ? 'unlocked' : ''}>500 clicks (seek help)</span>
      </div>
      <p className="dim">"{rickQuote()}"</p>
    </div>
  );
}