import { useState } from 'react';
import { Sound } from '../os/sound';
import type { AppProps } from '../os/types';

const PHOTOS = [
  { name: 'Dimensional wedding', note: 'Two universes, one awkward toast.', bg: 'linear-gradient(135deg,#ff7b54,#1b4332)' },
  { name: 'Rick at 3am', note: 'No one knows what happened here.', bg: 'radial-gradient(circle,#0a0a0f,#c53030)' },
  { name: 'The garage planet', note: 'Everything is garage. Forever.', bg: 'repeating-linear-gradient(45deg,#4d7c0f,#0a0a0f 40px)' },
  { name: 'Prison dimension', note: 'Five years of remorse. And a microwave.', bg: 'linear-gradient(180deg,#6b21a8,#0f172a)' },
  { name: 'Squeaks & beans', note: 'Larry\'s completely normal pet.', bg: 'radial-gradient(circle at 70% 20%,#fff3b0,#78290f)' },
  { name: 'Morty, stressed', note: 'Same energy, every dimension.', bg: 'linear-gradient(140deg,#3e5c76,#748cab)' },
];

export default function Photos({ windowId }: AppProps) {
  const [sel, setSel] = useState<number | null>(null);
  void windowId;

  return (
    <div className="photos">
      <div className="photos-grid">
        {PHOTOS.map((p, i) => (
          <button
            key={p.name}
            className={`photo-tile ${sel === i ? 'selected' : ''}`}
            style={{ background: p.bg }}
            onClick={() => {
              Sound.click();
              setSel(i);
            }}
          >
            <i className="fas fa-image" />
            <span>{p.name}</span>
          </button>
        ))}
      </div>
      <div className="photos-detail">
        {sel == null ? (
          <p className="dim">Pick a "memory" to relive it.</p>
        ) : (
          <article>
            <div className="photos-preview" style={{ background: PHOTOS[sel].bg }}><i className="fas fa-image" /></div>
            <h3>{PHOTOS[sel].name}</h3>
            <p>{PHOTOS[sel].note}</p>
          </article>
        )}
      </div>
    </div>
  );
}