import { useEffect, useRef, useState } from 'react';
import { Sound } from '../os/sound';
import { takeLatest } from '../os/channel';
import { useOs } from '../os/store';
import type { AppProps } from '../os/types';

const GALLERY = [
  { name: 'dimension-view.jpg', text: 'A planet that looks disturbingly like a butt. Not proud of it, but it made the ship\'s AI laugh.', bg: 'radial-gradient(circle at 30% 30%, #ff9a3d, #4a1e0f)' },
  { name: 'family.png', text: '"Family". It\'s complicated. Morty keeps asking why Sarah Lynn is here.', bg: 'linear-gradient(160deg,#1a1a2e,#16213e,#0f3460)' },
  { name: 'monster-trash.jpg', text: 'Photo from the monster dimension. He said he was "just here to chill".', bg: 'repeating-radial-gradient(circle,#3a0ca3,#7209b7)' },
  { name: 'citadel.png', text: 'The Citadel of Ricks glowing at 3am. Don\'t tell anyone we were there.', bg: 'radial-gradient(ellipse,#b8f0c0,#0b5b2e 70%)' },
];

export default function Viewer({ windowId }: AppProps) {
  const os = useOs();
  const [payload, setPayload] = useState<{ name?: string; text?: string } | null>(null);
  const ivRef = useRef<number | null>(null);

  useEffect(() => {
    const consume = () => {
      const ev = takeLatest('viewer');
      if (ev && typeof ev === 'object') setPayload(ev as { name?: string; text?: string });
    };
    consume();
    ivRef.current = window.setInterval(consume, 450);
    return () => {
      if (ivRef.current) window.clearInterval(ivRef.current);
      ivRef.current = null;
    };
  }, [windowId]);

  void windowId;

  const shown = payload ? [{ name: payload.name ?? 'file', text: payload.text ?? '', bg: 'radial-gradient(circle at 40% 30%, #37415c, #0a0d16)' }] : null;

  const image = (it: { name: string; text: string; bg: string }, i: number) => (
    <div className="photo-card" key={i} style={{ background: it.bg }}>
      <i className="fas fa-camera" />
      <span className="photo-name">{it.name}</span>
    </div>
  );

  const pick = (it: { name: string; text: string }) => {
    Sound.click();
    os.notify(it.name, it.text, '🖼️');
  };

  return (
    <div className="viewer">
      <div className="viewer-gallery">
        {(shown ?? GALLERY).map((it, i) => (
          <button key={i} onClick={() => pick(it)}>{image(it, i)}</button>
        ))}
      </div>
      <div className="viewer-desc">
        <b>{shown ? shown[0].name : 'A gallery of "totally normal" family photos'}</b>
        <p>{shown ? shown[0].text : 'Click any photo to hear its disturbing backstory.'}</p>
      </div>
    </div>
  );
}