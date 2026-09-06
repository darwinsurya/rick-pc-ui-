import { useEffect, useMemo, useRef, useState } from 'react';
import { useOs } from '../os/store';
import { Sound } from '../os/sound';

const DEFAULT_RECENT = ['terminal', 'files', 'browser', 'music', 'calculator', 'settings'];

export default function StartMenu({
  onClose,
  onPower,
}: {
  onClose: () => void;
  onPower: (a: 'restart' | 'shutdown' | 'logout') => void;
}) {
  const os = useOs();
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const all = useMemo(() => Object.values(os.appList).sort((a, b) => a.title.localeCompare(b.title)), [os.appList]);
  const recents = useMemo(() => {
    const list = [...(os.recentApps.length ? os.recentApps : DEFAULT_RECENT)];
    return list.map((id) => os.appList[id]).filter(Boolean) as (typeof all)[number][];
  }, [os.recentApps, os.appList]);

  const filtered = q.trim() ? all.filter((a) => a.title.toLowerCase().includes(q.toLowerCase())) : all;

  const open = (id: string) => {
    Sound.click();
    os.openApp(id);
    onClose();
  };

  return (
    <div className="start-menu" onClick={(e) => e.stopPropagation()}>
      <div className="sm-header">
        <div className="sm-avatar"><i className={`fas ${os.user.icon}`} /></div>
        <div>
          <b>{os.user.name}</b>
          <span>{os.user.role}</span>
        </div>
        <div className="sm-search">
          <i className="fas fa-search" />
          <input
            ref={input}
            value={q}
            placeholder="Search the universe..."
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered[0]) open(filtered[0].id);
            }}
          />
        </div>
      </div>

      <div className="sm-section">
        <span className="sm-label">RECENT</span>
        <div className="sm-recents">
          {recents.map((a) => (
            <button key={a.id} className="sm-tile" onClick={() => open(a.id)}>
              <i className={`fas ${a.icon}`} />
              <span>{a.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sm-section grow">
        <span className="sm-label">ALL APPS</span>
        <div className="sm-apps">
          {filtered.map((a) => (
            <button key={a.id} className="sm-app" onClick={() => open(a.id)}>
              <i className={`fas ${a.icon}`} />
              <span>{a.title}</span>
            </button>
          ))}
          {filtered.length === 0 && <div className="sm-empty">No results. Not even from another dimension.</div>}
        </div>
      </div>

      <div className="sm-footer">
        <button className="sm-power" title="Restart" onClick={() => { Sound.click(); onPower('restart'); }}>
          <i className="fas fa-sync-alt" /> Restart
        </button>
        <button className="sm-power" title="Shutdown" onClick={() => { Sound.click(); onPower('shutdown'); }}>
          <i className="fas fa-power-off" /> Shut Down
        </button>
        <button className="sm-power" title="Log out" onClick={() => { Sound.click(); onPower('logout'); }}>
          <i className="fas fa-sign-out-alt" /> Log Out
        </button>
      </div>
    </div>
  );
}