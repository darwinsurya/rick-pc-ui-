import { useEffect, useRef, useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import { confetti } from '../components/fx';
import type { AppProps } from '../os/types';

interface Channel {
  id: string;
  name: string;
  tag: string;
  feed: string[];
  color: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'news',
    name: 'CITADEL NEWS',
    tag: 'COUNCIL OF RICKS PUBLIC BROADCASTING',
    color: '#00ff41',
    feed: [
      'BREAKING: Rick C-137 farts loudly during press conference; nobody dares laugh.',
      'The Council reports another Rick tried to recruit all of himself. Vote it down, 1–0.',
      'Weather: heavy portal smog, intermittent antimatter drizzle.',
      'Sponsored by Blips and Chitz: URGHHHH, see it, believe it.',
    ],
  },
  {
    id: 'gazo',
    name: 'GAZORPAZORP TALKS',
    tag: 'REAL WOMEN. REAL VIOLENCE.',
    color: '#e86bff',
    feed: [
      'Today\'s guest says her husband needs to respect more. We send him to GLAKS GLAKS.',
      'Vote for mayor: a strong mate, or TWO strong mates.',
      'Cooking segment! Gnocchi, gnocchi, artichoke hearts.',
      'Our sponsors of the hour have big hands, says tonight\'s heroine.',
    ],
  },
  {
    id: 'atlantis',
    name: 'ATLANTIS DRAMA',
    tag: 'EVERYTHING IS A SHOCK',
    color: '#00d4ff',
    feed: [
      'Door missed by inches in tonight\'s big door-door slam special.',
      'Monica knows about Rachel. Rachel knows about Monica. Door abides.',
      'NEXT UP: a door-that-is-also-a-book. A book-door. DOOR.',
    ],
  },
  {
    id: 'purge',
    name: 'PURGE PLANET REALTIME',
    tag: 'STAY INSIDE. OR DON\'T.',
    color: '#ff5252',
    feed: [
      'Riot numbers up! We literally cannot count that high.',
      'Live look: someone is being chased by a very polite mob.',
      'A local business is 50% off — for the rest of the night. And maybe forever.',
    ],
  },
  {
    id: 'blips',
    name: 'BLIPS N CHITZ',
    tag: 'ADVERTISE OR DIE',
    color: '#b6ff00',
    feed: [
      'SHUT UP, IT\'S A HAMMER. BUY THE HAMMER.',
      'Roy: A Life Worth Living. Live it again. And again. And again.',
      'Hammer time every hour. This is a hammer.',
    ],
  },
  {
    id: 'morty',
    name: 'MORTY SCHOOL RUSH',
    tag: 'HARRY HERRPERSON PUBLIC ACCESS',
    color: '#ffd700',
    feed: [
      'Mr. Goldenfold is NOT pleased with the class-behavior field trip.',
      'Snuffles will be in class. Wait. We mean Snowball.',
      'Lunch is sloppy joes — or a portal to the meat dimension, we\'re not sure.',
    ],
  },
  {
    id: 'snake',
    name: 'SNAKE JAZZ',
    tag: 'HIGHLY EVOLVED',
    color: '#ff7b00',
    feed: [
      'Snakes reported jamming again. Ssssomebody ssssent them musicians.',
      'We apologize: next week\'s episode is bird jazz. We all hate birds.',
      'Ssssmithing sssserpentine, ssswanky sssolos.',
    ],
  },
  {
    id: 'unreal',
    name: 'UNREALITY JAM',
    tag: 'TOTALLY SWEARPORTAL',
    color: '#9b59b6',
    feed: [
      'Obama is checking you out. This is real.',
      'I think jumping thousands of years into the future has messed up my sense of unrelatable humor.',
      'Reminder: there are an infinite number of realities, but none of you matter.',
    ],
  },
];

function switchLine(ch: Channel, lastIdx: number) {
  if (lastIdx >= 0 && ch.feed[lastIdx]) return lastIdx;
  return Math.floor(Math.random() * ch.feed.length);
}

export default function InterdimensionalCable({ windowId }: AppProps) {
  const os = useOs();
  const [chIdx, setChIdx] = useState(0);
  const [textIdx, setTextIdx] = useState(() => 0);
  const [auto, setAuto] = useState(false);
  const [flicker, setFlicker] = useState(0);
  const [signal, setSignal] = useState(false);
  const [schwifty, setSchwifty] = useState(false);
  const autoRef = useRef<number | null>(null);
  const schwiftyTimer = useRef<number | null>(null);
  const ch = CHANNELS[chIdx];

  const hop = (i: number) => {
    if (i === chIdx) return;
    Sound.portalOpen();
    setFlicker(1);
    window.setTimeout(() => setFlicker(0), 260);
    setSignal(true);
    window.setTimeout(() => setSignal(false), 1900);
    setChIdx(i);
    setTextIdx(switchLine(CHANNELS[i], -1));
  };

  useEffect(() => {
    if (!auto) {
      if (autoRef.current) window.clearInterval(autoRef.current);
      autoRef.current = null;
      return;
    }
    autoRef.current = window.setInterval(() => {
      const i = (chIdx + Math.floor(Math.random() * (CHANNELS.length - 1)) + 1) % CHANNELS.length;
      hop(i);
    }, 3500);
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, chIdx]);

  void windowId;

  return (
    <div className="cable">
      <div className="cable-tv">
        <div className={`cable-signal ${signal ? 'show' : ''}`}>
          <i className="fas fa-tv" />
          <span>REMEMBER TO SWITCH</span>
        </div>
        <div className={`cable-screen ${flicker ? 'flick' : ''} ${schwifty ? 'schwifty' : ''}`}>
          <div className="cable-screen-glow" style={{ color: ch.color }}>
            <div className="cable-top">
              <b style={{ color: ch.color }}>{ch.name}</b>
              <span>{ch.tag}</span>
            </div>
            <div className="cable-text">
              <p>{ch.feed[textIdx]}</p>
              <button
                onClick={() => setTextIdx((i) => (i + 1) % ch.feed.length)}
                style={{ borderColor: ch.color, color: ch.color }}
              >
                NEXT FRAME
              </button>
            </div>
          </div>
          <div className="cable-scanlines" />
        </div>
        <div className="cable-channelbar">
          <i className="fas fa-tv" />
          <span>CH {String(chIdx + 1).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="cable-remotes">
        {CHANNELS.map((c, i) => (
          <button key={c.id} className={i === chIdx ? 'on' : ''} style={{ ['--cc' as string]: c.color }} onClick={() => hop(i)}>
            <i className="fas fa-tv" />
            {c.name}
          </button>
        ))}
      </div>
      <div className="cable-autohop">
        <label className="switch">
          <input type="checkbox" checked={auto} onChange={() => setAuto((a) => !a)} />
          <span className="switch-slider" />
        </label>
        <span>Auto-hop (you'll regret watching too long)</span>
        <button className={`schwifty ${schwifty ? 'lit' : ''}`} onClick={() => {
          if (schwifty) {
            setSchwifty(false);
            if (schwiftyTimer.current) window.clearTimeout(schwiftyTimer.current);
            return;
          }
          Sound.portalOpen();
          setSchwifty(true);
          confetti();
          os.notify('GET SCHWIFTY!', 'Channel re-tuned to maximum dance frequency. Party time.', '🕺');
          schwiftyTimer.current = window.setTimeout(() => setSchwifty(false), 8000);
        }}>
          <i className={`fas ${schwifty ? 'fa-music' : 'fa-tv'}`} /> {schwifty ? 'SETTLE DOWN' : 'GET SCHWIFTY'}
        </button>
      </div>
    </div>
  );
}