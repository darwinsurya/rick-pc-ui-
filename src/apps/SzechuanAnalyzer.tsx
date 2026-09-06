import { useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import { confetti } from '../components/fx';
import type { AppProps } from '../os/types';

export default function SzechuanAnalyzer({ windowId }: AppProps) {
  const os = useOs();
  const [flavor, setFlavor] = useState(50);
  const [spice, setSpice] = useState(40);
  const [consistency, setConsistency] = useState(60);
  const [result, setResult] = useState<string | null>(null);

  const analyze = () => {
    Sound.portalOpen();
    const bucket = Math.floor(flavor / 34) + Math.floor(spice / 34) * 3 + Math.floor(consistency / 34) * 5;
    const bucket2 = bucket + Math.floor((flavor * 3 + spice * 5 + consistency * 2) / 100);
    const map = [
      'Recovered 1998 Mulan McNugget dipping sauce. This is the sauce, Morty!',
      'New York-style sauce. Basically regret with a side of nostalgia.',
      'Szechuan-style mystery goo. The Mulan guy would NOT approve.',
      'Aggressively spicy sauce. It sings, it screams, it burns.',
      'The sauce is... Terra-formable? Somehow?',
      'Sad, watery sauce. A sentient puddle of "aw jeez".',
      'Perfect-blend sauce. The Citadel has a floor dedicated to this.',
      'Banned sauce. Level 6 interdimensional crime to possess it.',
    ];
    const idx = bucket2 % map.length;
    setResult(map[idx]);
    if (idx === 6 || idx === 0) confetti();
  };

  const serve = () => {
    os.addCrime('Trafficking suspicious sauce samples');
    Sound.error();
    os.notify('Evil Emperor (of evil)', 'You think my empire bows to sauce? (He wants the sauce.)', '🥡');
    window.setTimeout(() => {
      os.notify('Evil Emperor (of evil)', 'The fast-food empire needs it. NOW.', '🌶️');
      confetti();
    }, 1600);
  };

  void windowId;

  return (
    <div className="sauce">
      <div className="sauce-hero">
        <div className="sauce-bucket">
          <div className="sauce-goop" style={{ filter: `hue-rotate(${flavor * 3}deg)` }} />
          <i className="fas fa-utensils" />
        </div>
        <h2>Multiversal Szechuan Analyzer</h2>
        <p>One sauce. Infinite dimensions. Only one is the 1998 original.</p>
      </div>

      <div className="sauce-sliders">
        <label>Flavor <b>{flavor}</b><input type="range" min={0} max={100} value={flavor} onChange={(e) => setFlavor(+e.target.value)} /></label>
        <label>Spice Level <b>{spice}</b><input type="range" min={0} max={100} value={spice} onChange={(e) => setSpice(+e.target.value)} /></label>
        <label>Consistency <b>{consistency}</b><input type="range" min={0} max={100} value={consistency} onChange={(e) => setConsistency(+e.target.value)} /></label>
      </div>

      <div className="sauce-actions">
        <button className="sauce-analyze" onClick={analyze}><i className="fas fa-flask" /> Analyze Sauce</button>
        <button className="sauce-serve" onClick={serve}><i className="fas fa-crown" /> Serve to the Emperor</button>
      </div>

      {result && (
        <div className="sauce-result">
          <i className="fas fa-vial" />
          <p>{result}</p>
        </div>
      )}

      <p className="sauce-foot">Statistical confidence: 88%. Margin of error: the whole multiverse.</p>
    </div>
  );
}