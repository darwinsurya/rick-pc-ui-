import { useState } from 'react';
import { Sound } from '../os/sound';
import type { AppProps } from '../os/types';

const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const EVENTS: Record<string, string> = {
  '1': 'Pick up new portal fluid (10% off, Citadel AutoZone)',
  '4': 'Morty therapy session — run away first',
  '7': 'Council of Ricks quarterly meeting',
  '12': 'Return Mr. Meeseeks box (they asked for something after all)',
  '18': 'Test new szechuan sauce',
  '24': 'Dimension hop-a-thon',
  '27': 'Pay taxes to the Galactic Federation 🫠',
};

export default function CalendarApp({ windowId }: AppProps) {
  const [offset, setOffset] = useState(0);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + offset;
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysIn = new Date(year, month + 1, 0).getDate();
  const cells = [...Array.from({ length: firstDow }, () => null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  void windowId;

  return (
    <div className="cal-app">
      <div className="cal-app-head">
        <button onClick={() => { Sound.click(); setOffset(0); }}>Today</button>
        <button onClick={() => { Sound.click(); setOffset(offset - 1); }}><i className="fas fa-chevron-left" /></button>
        <b>{new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</b>
        <button onClick={() => { Sound.click(); setOffset(offset + 1); }}><i className="fas fa-chevron-right" /></button>
      </div>
      <div className="cal-app-grid">
        <div className="cal-app-headrow">
          {WEEK.map((d) => <span key={d}>{d}</span>)}
        </div>
        {Array.from({ length: Math.ceil(cells.length / 7) }, (_, r) => (
          <div className="cal-app-row" key={r}>
            {cells.slice(r * 7, r * 7 + 7).map((d, i) => (
              <div key={i} className={`cal-app-cell ${d === today.getDate() && offset === 0 ? 'is-today' : ''}`}>
                {d != null && (
                  <>
                    <span className="cal-app-num">{d}</span>
                    {EVENTS[d] && <p className="cal-app-event">{EVENTS[d]}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}