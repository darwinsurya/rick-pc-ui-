import { useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import { WALLPAPERS } from '../os/types';
import type { AppProps } from '../os/types';

export default function DimensionHopper({ windowId }: AppProps) {
  const os = useOs();
  const [on, setOn] = useState(() => Math.floor(Math.random() * WALLPAPERS.length));
  const [flash, setFlash] = useState(0);

  const hop = () => {
    Sound.portalOpen();
    setFlash(1);
    window.setTimeout(() => {
      setFlash(0);
      const next = (on + 1 + Math.floor(Math.random() * (WALLPAPERS.length - 1))) % WALLPAPERS.length;
      setOn(next);
      os.updateSettings({ wallpaper: next });
    }, 240);
    os.addCrime('Unlicensed dimension hopping');
  };

  void windowId;

  return (
    <div className="hopper">
      <div className={`hopper-portal ${flash ? 'open' : ''}`}>
        <i className="fas fa-sync" />
      </div>
      <h2>Dimension Hopper</h2>
      <p>Currently located in: <b>{WALLPAPERS[on].name}</b></p>
      <button className="hopper-btn" onClick={hop}><i className="fas fa-bolt" /> HOP DIMENSIONS</button>
      <div className="hopper-list">
        {WALLPAPERS.map((w, i) => (
          <button key={w.name} className={i === on ? 'on' : ''} style={{ background: w.css }} onClick={() => { setOn(i); os.updateSettings({ wallpaper: i }); }}>
            {w.name}
          </button>
        ))}
      </div>
      <p className="hopper-note">Propulsion Dimensional Hopping capabilities. Charges are not optional.</p>
    </div>
  );
}