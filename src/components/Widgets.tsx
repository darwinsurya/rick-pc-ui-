import { useEffect, useState } from 'react';
import { rickQuote } from '../os/quotes';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const iv = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(iv);
  }, []);
  return now;
}

interface Props {
  cpu: number;
  ram: number;
}

export default function Widgets({ cpu, ram }: Props) {
  const now = useClock();
  const [weather, setWeather] = useState(() => ({
    t: Math.round(22 + Math.random() * 16),
    d: ['Blips & Chitz quality', 'Citadel standard', 'Butter passing', 'Purge-tastic'][Math.floor(Math.random() * 4)],
    w: 'Partly portal',
  }));

  const quote = rickQuote();
  const hours = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');
  const dayName = now.toLocaleDateString(undefined, { weekday: 'long' });

  useEffect(() => {
    const iv = window.setInterval(() => setWeather((w) => ({ ...w, t: Math.round(w.t + Math.random() * 4 - 2) })), 30000);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <aside className="widgets">
      <div className="widget widget-clock">
        <div className="w-time">
          {hours}<span>:</span>{mins}
        </div>
        <div className="w-date">
          {dayName} · {now.toLocaleDateString()}
        </div>
      </div>

      <div className="widget">
        <div className="w-title"><i className="fas fa-cloud-sun-rain" /> Weather</div>
        <div className="w-body">
          <span className="w-temp">{weather.t}°C</span>
          <span className="w-desc">{weather.d} · {weather.w}</span>
        </div>
      </div>

      <div className="widget">
        <div className="w-title"><i className="fas fa-microchip" /> Temp &amp; Load</div>
        <div className="w-body">
          <div className="gauge-row">
            <span>Soul</span>
            <div className="gauge"><div style={{ width: `${cpu}%` }} /></div>
            <b>{cpu}%</b>
          </div>
          <div className="gauge-row">
            <span>Nerve</span>
            <div className="gauge"><div style={{ width: `${ram}%` }} /></div>
            <b>{ram}%</b>
          </div>
        </div>
      </div>

      <div className="widget widget-quote">
        <div className="w-title"><i className="fas fa-quote-right" /> Quote of the Day</div>
        <p>“{quote}”</p>
      </div>
    </aside>
  );
}