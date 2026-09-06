import { useEffect, useState } from 'react';
import { useOs } from '../os/store';
import { FS, type FsNode } from '../os/files';
import type { AppProps } from '../os/types';

const NET = [
  ['Name', 'Citadel OS'],
  ['Kernel', '9.9.9-rick-C137 (Multiversal)'],
  ['Dimension', 'C-137 · Primary'],
  ['Hardware', 'Portal-gun v4, Meeseeks Box (x2), Time Crystal'],
  ['CPU', 'RySlurm 9999X @ 4.9 exahertz'],
  ['Installed apps', 'All of them. Science requires it.'],
];

export default function SysInfo({ windowId }: AppProps) {
  const os = useOs();
  const [uptime, setUptime] = useState('0:00:00');
  void windowId;

  useEffect(() => {
    const iv = window.setInterval(() => {
      const secs = Math.floor((Date.now() - os.bootTime) / 1000);
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      setUptime(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);
    return () => window.clearInterval(iv);
  }, [os.bootTime]);

  const fileCount = (): number => {
    let n = 0;
    const recurse = (children?: Record<string, FsNode>) => {
      if (!children) return;
      Object.values(children).forEach((ch) => {
        n += 1;
        recurse(ch.children);
      });
    };
    recurse(FS.current().children);
    return n;
  };

  return (
    <div className="sysinfo">
      <div className="si-hero">
        <div className="portal3d one" />
        <h2>Citadel OS</h2>
        <p>v5.0.1 "Butter Pass"</p>
        <span className="si-chip">Serial: C137-⚠-DO-NOT-SHIP</span>
      </div>
      <div className="si-grid">
        {NET.map(([k, v]) => (
          <div className="si-row" key={k}>
            <b>{k}</b>
            <span>{v}</span>
          </div>
        ))}
        <div className="si-row"><b>Uptime</b><span>{uptime}</span></div>
        <div className="si-row"><b>File system occupancy</b><span>{fileCount()} items</span></div>
        <div className="si-row"><b>Battery</b><span>Portal-powered (infinite, allegedly)</span></div>
        <div className="si-row"><b>Internal monologue</b><span>42 voices, one is disappointed</span></div>
      </div>
    </div>
  );
}