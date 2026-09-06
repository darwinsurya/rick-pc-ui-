import * as React from 'react';
import { useOs } from '../os/store';
import type { PanelId } from './Panels';
import { Sound } from '../os/sound';

interface Props {
  startOpen: boolean;
  netOn: boolean;
  battery: number;
  onToggleStart: () => void;
  onTogglePanel: (p: PanelId) => void;
  onShowDesktop: () => void;
  onTaskMenu: (x: number, y: number, wid: number) => void;
}

function useTime() {
  const [d, setD] = React.useState(new Date());
  React.useEffect(() => {
    const iv = window.setInterval(() => setD(new Date()), 1000);
    return () => window.clearInterval(iv);
  }, []);
  return d;
}

export default function Taskbar({
  startOpen,
  netOn,
  battery,
  onToggleStart,
  onTogglePanel,
  onShowDesktop,
  onTaskMenu,
}: Props) {
  const os = useOs();
  const now = useTime();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const date = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const vol = os.settings.volume;

  return (
    <nav className="taskbar" onClick={(e) => e.stopPropagation()} onContextMenu={(e) => e.stopPropagation()}>
      <button
        className={`start-btn ${startOpen ? 'open' : ''}`}
        onClick={() => {
          Sound.click();
          onToggleStart();
        }}
      >
        <i className="fas fa-cube" />
        <span>START</span>
      </button>

      <div className="taskbar-apps" onDoubleClick={onShowDesktop}>
        {os.windows.map((w) => {
          const active = os.activeId === w.id && !w.minimized;
          return (
            <button
              key={w.id}
              className={`tb-app ${active ? 'active' : ''} ${w.minimized ? 'minimized' : ''}`}
              title={os.windowLabel(w)}
              onClick={() => {
                Sound.click();
                if (w.minimized || !active) os.restoreWindow(w.id);
                else os.minimizeWindow(w.id);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTaskMenu(e.clientX, e.clientY, w.id);
              }}
            >
              <i className={`fas ${w.icon}`} />
            </button>
          );
        })}
      </div>

      <div className="taskbar-tray">
        {os.wantedLevel > 0 && (
          <button
            id="tray-wanted"
            className={`tb-wanted lv${Math.min(7, os.wantedLevel)}`}
            title={`Galactic Federation · Wanted level ${os.wantedLevel}`}
            onClick={() => {
              Sound.click();
              onTogglePanel(null);
              os.openApp('wanted');
            }}
          >
            <i className="fas fa-star" />
            <b>{os.wantedLevel}</b>
          </button>
        )}
        <button
          id="tray-music"
          className={`tray-icon ${os.settings.music ? 'lit' : ''}`}
          title="Music"
          onClick={() => {
            Sound.click();
            os.updateSettings({ music: !os.settings.music });
          }}
        >
          <i className="fas fa-tower-broadcast" />
        </button>
        <button
          id="tray-net"
          className="tray-icon"
          title={netOn ? 'Galactic Net · Online' : 'Galactic Net · Offline'}
          onClick={() => onTogglePanel('net')}
        >
          <i className={`fas ${netOn ? 'fa-wifi' : 'fa-wifi-slash'}`} />
        </button>
        <button
          id="tray-volume"
          className="tray-icon"
          title={`Volume ${vol}%`}
          onClick={() => onTogglePanel('vol')}
        >
          <i className={`fas ${vol === 0 ? 'fa-volume-mute' : vol < 50 ? 'fa-volume-down' : 'fa-volume-up'}`} />
        </button>
        <button
          id="tray-power"
          className="tray-icon"
          title={`Battery ${battery}%`}
          onClick={() => onTogglePanel('power')}
        >
          <i className={`fas ${battery > 25 ? 'fa-battery-three-quarters' : 'fa-battery-quarter'}`} />
          <b style={{ marginLeft: 5 }}>{battery}%</b>
        </button>
        <button id="tray-clock" className="tray-clock" onClick={() => onTogglePanel('cal')}>
          <b>{h}:{m}</b>
          <span>{date}</span>
        </button>
        <button
          id="tray-notif"
          className="tray-icon notif-bell"
          title="Notifications"
          onClick={() => onTogglePanel('notif')}
        >
          <i className="far fa-bell" />
          {os.notifications.length > 0 && <span className="notif-count">{os.notifications.length}</span>}
        </button>
      </div>
    </nav>
  );
}