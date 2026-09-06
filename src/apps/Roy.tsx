import { useState } from 'react';
import { Sound } from '../os/sound';
import type { AppProps } from '../os/types';

const TRAITS = [
  'great at his job',
  'a little unremarkable',
  'surprisingly talented',
  'a real go-getter',
  'kind of a slacker',
  'undefeated at office volleyball',
];

const JOBNAMES = ['Data Analyst', 'Marketing Associate', 'Junior Toaster', 'HR Coordinator', 'Cubicle Manager', 'Coffee Runner', 'Project (Without Product) Manager'];
const TRIGGERS = ['golf handicap', 'school play', 'anniversary dinner', 'roof leak', 'pet hamster', 'interview prep', 'lawn', 'taxes'];

type Phase = 'menu' | 'live' | 'end';

function verdict(age: number, kids: number, jobs: number) {
  const career = jobs >= 5 ? 'a career powerhouse' : jobs >= 2 ? 'a steady working man' : 'a professional lounger';
  const family = kids >= 3 ? 'tragically, a family man' : kids >= 1 ? 'dad material' : 'a certified loner';
  const long = age >= 80 ? 'He lived (and kind of liked) a long life.' : age >= 55 ? 'He died doing paperwork. His heart gave out mid-Excel.' : 'A real rollercoaster of mediocrity. RIP to a legend (of average).';
  return { career, family, long };
}

export default function Roy({ windowId }: AppProps) {
  const [phase, setPhase] = useState<Phase>('menu');
  const [age, setAge] = useState(0);
  const [kids, setKids] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');
  const [natural, setNatural] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const pushLog = (m: string) => setLog((l) => (l.length > 24 ? [...l.slice(-23), m] : [...l, m]));

  const beginLife = () => {
    setAge(0);
    setKids(0);
    setJobs(0);
    setNatural(false);
    setLog([]);
    setBusy(false);
    setPhase('live');
    Sound.success();
    pushLog('ROY: A LIFE WELL LIVED — new life begins.');
    let lng = 0;
    const iv = window.setInterval(() => {
      lng++;
      setAge(lng);
      if (lng === 6) pushLog(`Little Roy is ${TRAITS[Math.floor(Math.random() * TRAITS.length)]}.`);
      if (lng === 14) pushLog('Roy gets a job. Exciting!');
      if (lng === 18) {
        setJobs(1);
        pushLog(`Roy's first job: ${JOBNAMES[0]}.`);
      }
      if (lng >= 96) {
        window.clearInterval(iv);
        setNatural(true);
        setPhase('end');
        pushLog('Roy died. A life well lived.');
      }
    }, 700);
  };

  const die = (atNatural: boolean) => {
    Sound.error();
    setNatural(atNatural);
    setPhase('end');
  };

  void windowId;
  const v = verdict(age, kids, jobs);

  return (
    <div className="roy">
      <div className="roy-screen">
        {phase === 'menu' && (
          <div className="roy-menu">
            <h2>ROY</h2>
            <p className="roy-sub">A LIFE WELL LIVED</p>
            <div className="roy-art"><i className="fas fa-user" /></div>
            <button onClick={beginLife}><i className="fas fa-play" /> Live as Roy</button>
            <button onClick={() => die(false)}><i className="fas fa-power-off" /> Skip existence</button>
            <small>Roy: a life well lived. Man, all the time. An eternity.</small>
          </div>
        )}

        {phase === 'live' && (
          <div className="roy-lived">
            <div className="roy-hud">
              <span className="roy-logo">ROY <i className="fas fa-fire" /></span>
              <span className="roy-age">Age: <b>{age}</b></span>
              <span className="roy-age">Kids: <b>{kids}</b></span>
              <span className="roy-age">Jobs: <b>{jobs}</b></span>
            </div>
            <div className="roy-avatar"><i className="fas fa-user" /><span>A VERITABLE ROY</span></div>
            <div className="roy-log">
              {log.slice(-6).map((m, i) => <p key={i}>{m}</p>)}
            </div>
            <div className="roy-controls">
              <button
                disabled={busy}
                onClick={() => {
                  if (busy) return;
                  setBusy(true);
                  const r = Math.random();
                  if (r < 0.5) {
                    const label = TRIGGERS[Math.floor(Math.random() * TRIGGERS.length)];
                    setBusyLabel(`Fixing the ${label} with a mild sense of duty...`);
                    pushLog(`Roy handles ${label} crisis.`);
                    window.setTimeout(() => {
                      setKids((k) => k + 1);
                      setBusy(false);
                      pushLog('Roy had a kid. Congrats.');
                      Sound.success();
                    }, 1400);
                  } else {
                    setBusyLabel('Doing important life stuff... (HR is involved somehow)');
                    window.setTimeout(() => {
                      setJobs((j) => j + 1);
                      setBusy(false);
                      pushLog(`Roy starts another job: ${JOBNAMES[Math.min(jobs + 1, JOBNAMES.length - 1)]}.`);
                    }, 1400);
                  }
                }}
              >{busy ? busyLabel : 'Simulate a life event'}</button>
              <button onClick={() => die(false)}>End life</button>
            </div>
          </div>
        )}

        {phase === 'end' && (
          <div className="roy-end">
            <div className={`roy-tomb ${natural ? 'fine' : 'ow'}`}><i className="fas fa-skull" /></div>
            <h2 className="roy-end-title">{natural ? 'ROY DIED — NATURAL CAUSES' : 'ROY DIED.'} (Avoidable.)</h2>
            <div className="roy-stats">
              <span>Age <b>{age}</b></span>
              <span>Kids <b>{kids}</b></span>
              <span>Jobs <b>{jobs}</b></span>
            </div>
            <p className="roy-obit">
              {v.career}, {v.family}. {v.long}
            </p>
            <p className="roy-verdict">Final score: {natural ? 'MEDIOCRE-BUT-FINE' : 'UNFINISHED BUSINESS'}</p>
            <div className="roy-controls">
              <button onClick={beginLife}><i className="fas fa-redo" /> Reincarnate as Roy</button>
            </div>
          </div>
        )}
      </div>
      <div className="roy-meta">
        <span>BUILT BY BLIPS and CHITZ</span>
        <span className="dim">not sponsored, it's raw bugs</span>
      </div>
    </div>
  );
}