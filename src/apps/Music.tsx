import { useEffect, useState } from 'react';
import { Sound } from '../os/sound';
import { confetti } from '../components/fx';
import type { AppProps } from '../os/types';

const ALBUMS = [
  { title: 'Get Schwifty', desc: 'A masterpiece of dimensional politics.', bg: 'linear-gradient(135deg,#7bff00,#0057ff)' },
  { title: 'Goodbye Moonmen', desc: 'Birdperson regressing to his solo-alt days.', bg: 'radial-gradient(circle,#ffe87c,#c0392b)' },
  { title: 'Mr. Meeseeks Anthem', desc: 'Performative cheer with existential subtext.', bg: 'linear-gradient(135deg,#00d4ff,#ff5252)' },
  { title: 'The Rickshank Redemption', desc: 'An absolute banger of a flex.', bg: 'repeating-linear-gradient(45deg,#0f0,#0a0a0f 20px)' },
];

export default function Music({ windowId }: AppProps) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const album = ALBUMS[idx];
  void windowId;

  useEffect(() => {
    return () => {
      setPlaying(false);
      window.clearInterval((window as unknown as { __rmMusicIv?: number }).__rmMusicIv);
    };
  }, []);

  const total = 214;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const toggle = () => {
    if (!playing) {
      setPlaying(true);
      const iv = window.setInterval(() => {
        setPos((p) => {
          if (p >= total) {
            window.clearInterval(iv);
            setPlaying(false);
            setPos(0);
            confetti();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
      (window as unknown as { __rmMusicIv?: number }).__rmMusicIv = iv;
    } else {
      setPlaying(false);
      window.clearInterval((window as unknown as { __rmMusicIv?: number }).__rmMusicIv);
    }
  };

  const pick = (i: number) => {
    Sound.click();
    setIdx((i + ALBUMS.length) % ALBUMS.length);
    setPos(0);
  };

  return (
    <div className="music-app">
      <div className="album-art" style={{ background: album.bg }}>
        <i className="fas fa-music" />
        <span className="album-title">{album.title}</span>
      </div>
      <div className="music-info">
        <b>{album.title}</b>
        <span className="dim">{album.desc}</span>
      </div>
      <div className="music-controls">
        <button onClick={() => pick(idx - 1)}><i className="fas fa-step-backward" /></button>
        <button className="music-play" onClick={toggle}>
          <i className={`fas ${playing ? 'fa-pause' : 'fa-play'}`} />
        </button>
        <button onClick={() => pick(idx + 1)}><i className="fas fa-step-forward" /></button>
      </div>
      <div className="music-progress">
        <span>{fmt(pos)}</span>
        <div className="mp-bar"><div style={{ width: `${(pos / total) * 100}%` }} /></div>
        <span>{fmt(total)}</span>
      </div>
      <div className="music-list">
        {ALBUMS.map((a, i) => (
          <button key={a.title} className={i === idx ? 'now' : ''} onClick={() => pick(i)}>
            <i className="fas fa-music" />
            {a.title}
            {i === idx && playing && <i className="fas fa-volume-up eq" />}
          </button>
        ))}
      </div>
    </div>
  );
}