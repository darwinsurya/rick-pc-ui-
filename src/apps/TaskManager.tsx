import { useEffect, useMemo, useState } from 'react';
import { useOs } from '../os/store';
import { FS } from '../os/files';
import type { AppProps } from '../os/types';

export default function TaskManager({ windowId }: AppProps) {
  const os = useOs();
  const [cpu, setCpu] = useState(11);
  const [mem, setMem] = useState(42);
  void windowId;

  useEffect(() => {
    const iv = window.setInterval(() => {
      setCpu((c) => Math.max(4, Math.min(100, c + Math.round(Math.random() * 14 - 7))));
      setMem((m) => Math.max(38, Math.min(96, m + Math.round(Math.random() * 6 - 3))));
    }, 1500);
    return () => window.clearInterval(iv);
  }, []);

  const procs = useMemo<{ name: string; pid: number; cpu: number; mem: string; wid?: number; memNote?: string }[]>(() => {
    const base = Math.max(1, Math.round(cpu / Math.max(1, os.windows.length)));
    return [
      { name: 'System Idle Process', pid: 0, cpu: Math.max(0, 100 - cpu), mem: '2 MB' },
      ...os.windows.map((w) => ({
        name: os.windowLabel(w),
        pid: 1000 + w.id,
        cpu: Math.max(1, base),
        mem: `${40 + (w.id % 9) * 14} MB`,
        wid: w.id,
      })),
      { name: 'portal-gun.exe', pid: 2431, cpu: 1, mem: '789 MB', memNote: 'Seriously, close it.' },
      { name: 'szechuan-sauce.dao', pid: 3007, cpu: 12, mem: '3 TB', memNote: '(mythical)' },
      { name: 'whistle-keys.exe', pid: 87, cpu: 4, mem: '16 GB' },
    ];
  }, [cpu, os.windows, os.windowLabel]);

  return (
    <div className="tm">
      <div className="tm-stats">
        <div className="tm-stat"><i className="fas fa-microchip" /><b>{Math.round(cpu)}%</b><span>CPU</span></div>
        <div className="tm-stat"><i className="fas fa-memory" /><b>{Math.round(mem)}%</b><span>Memory</span></div>
        <div className="tm-stat"><i className="fas fa-hdd" /><b>{procs.length}</b><span>Processes</span></div>
        <div className="tm-stat"><i className="fas fa-bolt" /><b>∞</b><span>Flux</span></div>
      </div>
      <div className="tm-list">
        <table>
          <thead>
            <tr><th>Name</th><th>PID</th><th>CPU</th><th>Memory</th><th /></tr>
          </thead>
          <tbody>
            {procs.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.pid}</td>
                <td>{Math.round(p.cpu)}%</td>
                <td>{p.mem}</td>
                <td>
                  {p.wid != null && (
                    <button className="tm-kill" onClick={() => os.closeWindow(p.wid!)}>End task</button>
                  )}
                  {p.memNote && <i className="dim">{p.memNote}</i>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="dim" style={{ padding: '6px 14px' }}>FS size: {JSON.stringify(FS.current()).length} bytes, give or take a dimension.</p>
    </div>
  );
}