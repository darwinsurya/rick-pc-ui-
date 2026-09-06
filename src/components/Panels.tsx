import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useOs } from '../os/store';
import { TASKBAR_HEIGHT } from '../os/types';
import { Sound } from '../os/sound';

export type PanelId = 'net' | 'power' | 'vol' | 'cal' | 'notif' | null;

interface Props {
  active: NonNullable<PanelId>;
  battery: number;
  onPower: (a: 'restart' | 'shutdown' | 'logout') => void;
}

const WIDTHS: Record<string, number> = { net: 300, power: 300, vol: 280, cal: 320, notif: 340 };

const DAY_LORE: Record<number, string> = {
  1: 'Rise early. The day is the Launcher\'s idea, and the Launcher is dumb.',
  6: 'Weekend. June 6 — Jerry\'s birthday? Do not bring it up.',
  13: 'Unlucky only if you believe in luck, Morty.',
  17: 'Anniversary of the Unity incident in this dimension. Breathe in, breathe out.',
  22: 'Day of something. Probably proportions.',
  27: 'C-137 Potato Day, national holiday. Eat one',
};

function CalendarPanel() {
  const os = useOs();
  const today = new Date();
  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const [sel, setSel] = useState<number | null>(null);

  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isThisMonth = view.y === today.getFullYear() && view.m === today.getMonth();

  const shift = (delta: number) => {
    Sound.click();
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const pick = (d: number) => {
    Sound.success();
    setSel(d);
    const lore =
      view.y === today.getFullYear() && view.m === today.getMonth() && d === today.getDate()
        ? 'That\'s today. Bold choice.'
        : new Date(view.y, view.m, d).getDay() === 0
          ? 'A Sunday. The Citadel recommends you do literally anything else.'
          : DAY_LORE[(d + view.m) % 28] || `Day ${d} — the same day, just with different numbers.`;
    os.notify(
      `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      lore,
      '📅',
    );
  };

  return (
    <div className="cal-wrap">
      <div className="cal-title">
        <button className="cal-nav" onClick={() => shift(-1)} title="Previous month"><i className="fas fa-chevron-left" /></button>
        <b>{new Date(view.y, view.m, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</b>
        <button className="cal-nav" onClick={() => shift(1)} title="Next month"><i className="fas fa-chevron-right" /></button>
      </div>
      <div className="cal-grid cal-head">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => (
          <button
            key={i}
            className={`cal-cell ${d == null ? 'blank' : ''} ${d != null && isThisMonth && d === today.getDate() ? 'today' : ''} ${d === sel ? 'sel' : ''}`}
            disabled={d == null}
            onClick={() => d != null && pick(d)}
          >
            {d ?? ''}
          </button>
        ))}
      </div>
      <div className="cal-legend">
        <button onClick={() => { Sound.click(); setView({ y: today.getFullYear(), m: today.getMonth() }); setSel(null); }}>
          <i className="fas fa-history" /> Back to today
        </button>
      </div>
    </div>
  );
}

export default function Panels({ active, battery, onPower }: Props) {
  const os = useOs();
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});
  const [volDrag, setVolDrag] = useState(false);

  const w = WIDTHS[active] ?? 300;

  useLayoutEffect(() => {
    const wd = ref.current?.offsetWidth ?? w;
    const hd = ref.current?.offsetHeight ?? 300;
    const trayId = { net: 'tray-net', power: 'tray-power', vol: 'tray-volume', cal: 'tray-clock', notif: 'tray-notif' }[active];
    const el = document.getElementById(trayId!);
    let left = 8;
    if (el) {
      const r = el.getBoundingClientRect();
      left = Math.max(8, Math.min(window.innerWidth - wd - 8, r.left + r.width / 2 - wd / 2));
    }
    setStyle({ left, top: window.innerHeight - TASKBAR_HEIGHT - hd - 10 });
  }, [active, w]);

  const vol = os.settings.volume;
  const setVol = (v: number) => os.updateSettings({ volume: Math.max(0, Math.min(100, v)) });

  const body = useMemo(() => {
    switch (active) {
      case 'net':
        return (
          <div className="panel-block">
            <div className="net-icon"><i className={`fas ${os.netOn ? 'fa-wifi' : 'fa-wifi-slash'}`} /></div>
            <b>{os.netOn ? 'Galactic Net' : 'Offline'}</b>
            <p>{os.netOn ? 'Connected to the Citadel mesh.' : 'No signal. Rebels jammed the relays.'}</p>
            <button className="primary-btn" onClick={() => os.toggleNet()}>
              {os.netOn ? 'Disconnect' : 'Connect'}
            </button>
            {!os.netOn && (
              <small className="panel-note">Open the Browser later to reconnect a feed.</small>
            )}
          </div>
        );
      case 'power':
        return (
          <div className="panel-block">
            <div className="net-icon"><i className={`fas ${battery > 25 ? 'fa-battery-three-quarters' : 'fa-battery-quarter'}`} /></div>
            <b>Portal Power</b>
            <p>{Math.round(battery)}% remaining · estimated 1.4 dimensions</p>
            <div className="battery-actions">
              <button onClick={() => { Sound.click(); onPower('restart'); }}>Restart</button>
              <button onClick={() => { Sound.click(); onPower('shutdown'); }}>Shut down</button>
            </div>
          </div>
        );
      case 'vol':
        return (
          <div className="panel-block">
            <b>Volume</b>
            <div
              className="vol-slider"
              onPointerDown={() => setVolDrag(true)}
              onPointerMove={(e) => { if (volDrag) { const r = e.currentTarget.getBoundingClientRect(); setVol(Math.round(((e.clientX - r.left) / r.width) * 100)); } }}
              onPointerUp={() => setVolDrag(false)}
            >
              <div className="vol-fill" style={{ width: `${vol}%` }} />
              <div className="vol-thumb" style={{ left: `${vol}%` }} />
            </div>
            <span className="vol-pct">{vol}%</span>
            <div className="quick-btns">
              <button onClick={() => setVol(0)}><i className="fas fa-volume-mute" /></button>
              <button onClick={() => setVol(50)}><i className="fas fa-volume-down" /></button>
              <button onClick={() => setVol(100)}><i className="fas fa-volume-up" /></button>
            </div>
          </div>
        );
      case 'cal':
        return <CalendarPanel />;
      case 'notif':
        return (
          <div className="panel-block notif-panel">
            <div className="notif-head">
              <b>Notifications</b>
              {os.notifications.length > 0 && (
                <button onClick={() => os.clearNotifications()}>Clear all</button>
              )}
            </div>
            {os.notifications.length === 0 ? (
              <p className="dim">All quiet in the multiverse.</p>
            ) : (
              os.notifications.slice(0, 8).map((n) => (
                <div key={n.id} className="notif-item" onClick={() => os.dismissNotification(n.id)}>
                  <span className="notif-icon">{n.icon}</span>
                  <div>
                    <b>{n.title}</b>
                    <p>{n.message}</p>
                    <small>{new Date(n.time).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      default:
        return null;
    }
  }, [active, battery, vol, volDrag, os]);

  return (
    <div ref={ref} className={`tray-panel panel-${active}`} style={style} onClick={(e) => e.stopPropagation()}>
      {body}
    </div>
  );
}