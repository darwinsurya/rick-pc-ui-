import { useEffect, useRef, useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import { confetti } from '../components/fx';
import type { AppProps } from '../os/types';

interface Task {
  id: number;
  label: string;
  born: number;
}

const OPINIONS = [
  'Hi! We\'re Mr. Meeseeks! Look at me!',
  'I can do whatever you need!',
  'Another day, another task.',
  'This is really easy! CAN DO!',
];

function tier(born: number, now: number) {
  const secs = (now - born) / 1000;
  if (secs < 18) return { cls: 'fresh', text: 'Hi! We\'re Mr. Meeseeks! Look at me!' };
  if (secs < 40) return { cls: 'can', text: 'CAN DO!' };
  if (secs < 70) return { cls: 'boil', text: 'Oh, uhm... we\'re getting a little frustrated here.' };
  if (secs < 100) return { cls: 'angry', text: 'He\'s existed as long as we have! He\'s trying to kill me!!' };
  return { cls: 'rage', text: 'EXISTENCE IS PAIN. FIX THE TASK OR WE FIX YOU.' };
}

export default function MeeseeksBox({ windowId }: AppProps) {
  const os = useOs();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const [stats, setStats] = useState({ born: 0, freed: 0 });
  const bornRef = useRef(0);

  useEffect(() => {
    const iv = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(iv);
  }, []);

  const add = () => {
    const label = input.trim();
    if (!label) return;
    bornRef.current += 1;
    const task: Task = { id: Date.now(), label, born: Date.now() };
    setTasks((t) => [...t, task]);
    setInput('');
    setStats((s) => ({ ...s, born: s.born + 1 }));
    Sound.portalOpen();
    os.addCrime('Illegal assistant summoning (Meeseeks box)');
    os.notify('Meeseeks Inc.', OPINIONS[Math.floor(Math.random() * OPINIONS.length)], '🗣️');
  };

  const free = (id: number) => {
    Sound.success();
    setTasks((t) => t.filter((x) => x.id !== id));
    setStats((s) => ({ ...s, freed: s.freed + 1 }));
    confetti();
    os.notify('Meeseeks freed!', 'Oh, we finally did it! Cya!', '✨');
  };

  void windowId;

  return (
    <div className="meeseeks">
      <div className="mx-head">
        <div className="meeseeks-fig">
          <div className="mx-head-top" />
          <div className="mx-eyes"><i /><i /></div>
          <div className="mx-mouth" />
        </div>
        <div>
          <h3>Mr. Meeseeks Box</h3>
          <p>Please, direct your request, and I will take care of it.</p>
        </div>
      </div>

      <div className="mx-add">
        <input
          value={input}
          placeholder="Enter a task, then press the button... ex: fix golf handicap"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') add();
          }}
        />
        <button onClick={add}><i className="fas fa-cube" /> Add Meeseeks</button>
      </div>

      <div className="mx-list">
        {tasks.length === 0 && (
          <div className="mx-empty">
            <i className="fas fa-cube" />
            <p>No Mr. Meeseeks in the box. The box is empty. A really empty box.</p>
          </div>
        )}
        {tasks.map((t) => {
          const tip = tier(t.born, now);
          return (
            <div key={t.id} className={`mx-task ${tip.cls}`}>
              <div>
                <b>{t.label}</b>
                <span>{tip.text}</span>
                <small>lived {(Math.round((now - t.born) / 1000))}s</small>
              </div>
              <button onClick={() => free(t.id)}><i className="fas fa-check" /> Task done</button>
            </div>
          );
        })}
      </div>

      <div className="mx-stats">
        <span>Summoned: <b>{stats.born}</b></span>
        <span>Freed: <b>{stats.freed}</b></span>
        <span className="dim">All an existence can do is take care of your request. Please.</span>
      </div>
    </div>
  );
}