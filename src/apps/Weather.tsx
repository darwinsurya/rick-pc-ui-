import { useState } from 'react';
import { Sound } from '../os/sound';
import type { AppProps } from '../os/types';

type Cond = 'portal-y' | 'schwifty' | 'acid' | 'purge';

const CITIES: Record<string, Cond> = {
  'C-137 (Home)': 'portal-y',
  'Citadel of Ricks': 'portal-y',
  'Gazorpazorp': 'acid',
  'Birdperson Planet': 'schwifty',
  'Blitz and Chitz': 'purge',
  'Dimension 35-C': 'portal-y',
};

const COND_META: Record<Cond, [string, string]> = {
  'portal-y': ['fa-rainbow', 'Everything is green. Very normal color.'],
  schwifty: ['fa-music', 'You should probably get schwifty.'],
  acid: ['fa-flask', 'Mildly corrosive atmosphere. Avoid open wounds, jokes aside.'],
  purge: ['fa-sun', 'Violently sunny. Better than the purge it implies.'],
};

export default function Weather({ windowId }: AppProps) {
  const [city, setCity] = useState('C-137 (Home)');
  const [temp, setTemp] = useState(() => Math.round(18 + Math.random() * 15));
  const [days, setDays] = useState(() =>
    Array.from({ length: 4 }, () => Math.round(16 + Math.random() * 18)),
  );
  void windowId;

  const cond = CITIES[city];
  const [icon, desc] = COND_META[cond];

  const refresh = () => {
    Sound.success();
    setTemp(Math.round(18 + Math.random() * 15));
    setDays(Array.from({ length: 4 }, () => Math.round(16 + Math.random() * 18)));
  };

  return (
    <div className="weather">
      <div className="wx-loc">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          {Object.keys(CITIES).map((c2) => <option key={c2}>{c2}</option>)}
        </select>
        <button onClick={refresh}><i className="fas fa-sync-alt" /></button>
      </div>
      <div className="wx-now">
        <i className={`fas ${icon} wx-icon`} />
        <div>
          <h2>{temp}°C</h2>
          <p>{desc}</p>
        </div>
      </div>
      <div className="wx-days">
        {['Tomorrow', 'Day 3', 'Day 4', 'Day 5'].map((d, i) => (
          <div className="wx-day" key={d}>
            <span>{d}</span>
            <i className={`fas ${i % 2 ? 'fa-cloud-sun' : 'fa-sun'}`} />
            <b>{days[i]}°C</b>
          </div>
        ))}
      </div>
      <p className="dim">Forecast provided by the Galactic Weather Service. Accuracy: 11%.</p>
    </div>
  );
}