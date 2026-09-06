import { useEffect, useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import type { AppProps } from '../os/types';

interface Alarm {
  id: number;
  time: string;
  label: string;
  on: boolean;
  firedDate?: string;
}

const KEY = 'rm-alarms';

function loadAlarms(): Alarm[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Alarm[];
  } catch {
    /* ignore */
  }
  const base: Alarm[] = [
    { id: 1, time: '07:00', label: 'Time to ruin Morty\'s day', on: true },
    { id: 2, time: '12:00', label: 'Lunch (with extra crying)', on: false },
    { id: 3, time: '23:59', label: 'Wubba Lubba Dub Dub', on: false },
  ];
  return base;
}

function ClockFace({ value, size }: { value: Date; size: number }) {
  const radius = size / 2;
  const hourDeg = ((value.getHours() % 12) + value.getMinutes() / 60) * 30;
  const minDeg = (value.getMinutes() + value.getSeconds() / 60) * 6;
  const secDeg = value.getSeconds() * 6;
  return (
    <div className="clock-face" style={{ width: size, height: size }}>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="tk"
          style={{ transform: `rotate(${i * 30}deg) translateY(-${radius - 11}px)` }}
        >
          <i />
        </span>
      ))}
      <div className="hand hour" style={{ transform: `rotate(${hourDeg}deg)` }} />
      <div className="hand minute" style={{ transform: `rotate(${minDeg}deg)` }} />
      <div className="hand second" style={{ transform: `rotate(${secDeg}deg)` }} />
      <div className="pin" />
      <div className="center-text" style={{ fontSize: radius / 8 }}>C137</div>
    </div>
  );
}

export default function ClockApp({ windowId }: AppProps) {
  const os = useOs();
  const [now, setNow] = useState(() => new Date());
  const [alarms, setAlarms] = useState<Alarm[]>(loadAlarms);
  const [newTime, setNewTime] = useState('07:00');
  const [newLabel, setNewLabel] = useState('');
  void windowId;

  useEffect(() => {
    const persist = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(alarms));
      } catch {
        /* ignore */
      }
    };
    persist();
  }, [alarms]);

  useEffect(() => {
    const iv = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    const cur = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toLocaleDateString();
    let fired = false;
    setAlarms((prev) => {
      let changed = false;
      const next = prev.map((a) => {
        if (a.on && a.time === cur && a.firedDate !== today) {
          changed = true;
          fired = true;
          return { ...a, firedDate: today };
        }
        return a;
      });
      return changed ? next : prev;
    });
    if (fired) {
      Sound.portalOpen();
      os.notify('Alarm', `☀️ ${cur} — time to exist. Hope you were asleep.`, '⏰');
      window.setTimeout(() => Sound.success(), 250);
    }
  }, [now, os]);

  const add = () => {
    if (!newTime) return;
    const entry: Alarm = { id: Date.now(), time: newTime, label: newLabel.trim() || 'Alarm', on: true };
    setAlarms((a) => [...a, entry]);
    setNewLabel('');
    Sound.success();
  };

  const setOn = (id: number, on: boolean) => setAlarms((a) => a.map((x) => (x.id === id ? { ...x, on } : x)));
  const remove = (id: number) => setAlarms((a) => a.filter((x) => x.id !== id));

  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');

  return (
    <div className="clock-app">
      <div className="clock-main">
        <ClockFace value={now} size={220} />
        <div className="clock-digital">
          <b>{h}:{m}:{s}</b>
          <span>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      <div className="clock-alarms">
        <b>Alarms</b>
        {alarms.length === 0 && <p className="clock-none">No alarms. Dangerously under-scheduled.</p>}
        {alarms.map((a) => (
          <div className={`clock-alarm ${a.on ? 'on' : ''}`} key={a.id}>
            <i className="fas fa-alarm-clock" />
            <b>{a.time}</b>
            <span>{a.label}</span>
            <label className="switch">
              <input type="checkbox" checked={a.on} onChange={() => setOn(a.id, !a.on)} />
              <span className="switch-slider" />
            </label>
            <button className="clock-rm" title="Delete alarm" onClick={() => remove(a.id)}>
              <i className="fas fa-trash" />
            </button>
          </div>
        ))}
        <div className="clock-add">
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
          <input
            value={newLabel}
            placeholder="Alarm name..."
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') add();
            }}
          />
          <button onClick={add} title="Add alarm"><i className="fas fa-plus" /> Add</button>
        </div>
        <p className="clock-tip">Tip: alarms fire once per day, then stay silent until tomorrow.</p>
      </div>
    </div>
  );
}