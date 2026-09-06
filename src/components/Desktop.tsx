import { useCallback, useEffect, useRef, useState } from 'react';
import { useOs } from '../os/store';
import { WALLPAPERS } from '../os/types';
import { Sound } from '../os/sound';
import Widgets from './Widgets';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Panels, { type PanelId } from './Panels';
import Toasts from './Toasts';
import ContextMenu from './ContextMenu';
import PowerOverlay from './PowerOverlay';
import { confetti } from './fx';

interface MenuInfo {
  x: number;
  y: number;
}

export default function Desktop() {
  const os = useOs();
  const [startOpen, setStartOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelId>(null);
  const [context, setContext] = useState<MenuInfo | null>(null);
  const [taskMenu, setTaskMenu] = useState<(MenuInfo & { wid: number }) | null>(null);
  const [battery, setBattery] = useState(100);
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);
  const [power, setPower] = useState<'none' | 'restart' | 'shutdown'>('none');
  const [poopy, setPoopy] = useState(false);
  const keys = useRef('');

  const winCount = os.windows.length;

  useEffect(() => {
    const iv = window.setInterval(() => {
      setBattery((b) => Math.max(5, Math.min(100, b + Math.random() * 2 - 1)));
      setCpu(Math.min(98, Math.round(20 + winCount * 9 + Math.random() * 15)));
      setRam(Math.min(84, Math.round(30 + winCount * 6 + Math.random() * 10)));
    }, 2500);
    return () => window.clearInterval(iv);
  }, [winCount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStartOpen(false);
        setActivePanel(null);
        setContext(null);
        setTaskMenu(null);
      }
      if (e.key === 'Meta') {
        e.preventDefault();
        setActivePanel(null);
        setStartOpen((o) => !o);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        os.showDesktop();
      }
      if (e.key && e.key.length === 1) {
        keys.current = (keys.current + e.key).toLowerCase().replace(/[^a-z0-9]/g, '').slice(-40);
        if (keys.current.endsWith('getschwifty')) {
          keys.current = '';
          Sound.portalOpen();
          confetti();
          os.notify('GET SCHWIFTY!', 'Head to the dance floor. Rick approves.', '🕺');
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [os]);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setPoopy(true);
      window.setTimeout(() => setPoopy(false), 4800);
    }, 60000);
    return () => window.clearInterval(iv);
  }, []);

  const closeAll = useCallback(() => {
    setStartOpen(false);
    setActivePanel(null);
    setContext(null);
    setTaskMenu(null);
  }, []);

  const cycleWallpaper = useCallback(() => {
    const next = (os.settings.wallpaper + 1) % WALLPAPERS.length;
    os.updateSettings({ wallpaper: next });
    Sound.success();
    os.notify('Wallpaper changed!', WALLPAPERS[next].name + ' — very science-y.', '🌌');
  }, [os]);

  return (
    <div
      className="os-desktop"
      onClick={closeAll}
      onContextMenu={(e) => {
        e.preventDefault();
        closeAll();
        setContext({ x: e.clientX, y: e.clientY });
      }}
    >
      <div className="desktop-bg" style={{ background: WALLPAPERS[os.settings.wallpaper].css }}>
        <div className="portal portal-1" />
        <div className="portal portal-2" />
        <div className="portal portal-3" />
        <div className="stars" />
        <div className="scene3d">
          <div className="space-cube large" style={{ ['--s' as string]: '90px' }}>
            <div className="face front" /><div className="face back" />
            <div className="face left" /><div className="face right" />
            <div className="face top" /><div className="face bottom" />
          </div>
          <div className="space-cube medium" style={{ ['--s' as string]: '55px' }}>
            <div className="face front" /><div className="face back" />
            <div className="face left" /><div className="face right" />
            <div className="face top" /><div className="face bottom" />
          </div>
          <div className="space-cube small" style={{ ['--s' as string]: '34px' }}>
            <div className="face front" /><div className="face back" />
            <div className="face left" /><div className="face right" />
            <div className="face top" /><div className="face bottom" />
          </div>
          <div className="portal3d one" />
          <div className="portal3d two" />
        </div>
      </div>

      {os.settings.showWidgets && <Widgets cpu={cpu} ram={ram} />}

      <div className="desktop-icons">
        {Object.values(os.appList)
          .filter((a) => a.desktop !== false)
          .map((a) => (
            <div
              key={a.id}
              className="desktop-icon"
              title={a.title}
              onClick={(e) => {
                e.stopPropagation();
                Sound.click();
                os.openApp(a.id);
              }}
            >
              <i className={`fas ${a.icon}`} />
              <span>{a.title}</span>
            </div>
          ))}
      </div>

      <div className="os-workspace">
        {os.windows.map((w) => (w.minimized ? null : <Window key={w.id} w={w} />))}
      </div>

      <Taskbar
        startOpen={startOpen}
        netOn={os.netOn}
        battery={Math.round(battery)}
        onToggleStart={() => {
          setActivePanel(null);
          setStartOpen((o) => !o);
        }}
        onTogglePanel={(p) => {
          setStartOpen(false);
          setActivePanel((cur) => (cur === p ? null : p));
        }}
        onShowDesktop={() => os.showDesktop()}
        onTaskMenu={(x, y, wid) => {
          closeAll();
          setTaskMenu({ x, y, wid });
        }}
      />

      {startOpen && (
        <StartMenu
          onClose={() => setStartOpen(false)}
          onPower={(a) => {
            if (a === 'restart') {
              Sound.powerOff();
              setPower('restart');
              setStartOpen(false);
            } else if (a === 'shutdown') {
              Sound.powerOff();
              setPower('shutdown');
              setStartOpen(false);
            } else {
              window.location.reload();
            }
          }}
        />
      )}

      {activePanel && (
        <Panels
          active={activePanel}
          battery={Math.round(battery)}
          onPower={(a) => {
            setActivePanel(null);
            if (a === 'restart') {
              Sound.powerOff();
              setPower('restart');
            } else if (a === 'shutdown') {
              Sound.powerOff();
              setPower('shutdown');
            } else {
              window.location.reload();
            }
          }}
        />
      )}

      <Toasts />

      {poopy && (
        <div className="poopy" onClick={() => { confetti(); Sound.success(); setPoopy(false); }}>
          <div className="poopy-bubble">Ooh-wee! Don't mind me!</div>
          <span className="poopy-body">🕴️</span>
          <small>Mr. Poopybutthole</small>
        </div>
      )}

      {context && (
        <ContextMenu
          x={context.x}
          y={context.y}
          onClose={() => setContext(null)}
          items={[
            { icon: 'fa-sync', label: 'Refresh Dimension', action: () => { confetti(); os.addCrime('Interdimensional tampering (unauthorized refresh)'); os.notify('Dimension refreshed!', 'Fresh dimension air. Also the Federation is watching.', '🌀'); } },
            { icon: 'fa-image', label: 'Change Wallpaper', action: cycleWallpaper },
            { icon: 'fa-chart-line', label: 'Toggle Widgets', action: () => os.updateSettings({ showWidgets: !os.settings.showWidgets }) },
          ]}
          sep
          items2={[
            { icon: 'fa-terminal', label: 'Open Terminal', action: () => os.openApp('terminal') },
            { icon: 'fa-tasks', label: 'Task Manager', action: () => os.openApp('taskmanager') },
            { icon: 'fa-cog', label: 'Settings', action: () => os.openApp('settings') },
          ]}
        />
      )}

      {taskMenu && (
        <ContextMenu
          x={taskMenu.x}
          y={taskMenu.y}
          onClose={() => setTaskMenu(null)}
          items={[
            { icon: 'fa-window-maximize', label: 'Bring to front', action: () => os.restoreWindow(taskMenu.wid) },
            { icon: 'fa-times', label: 'Close', action: () => os.closeWindow(taskMenu.wid) },
          ]}
        />
      )}

      {power === 'restart' && <PowerOverlay label="REBOOTING..." sub="Clearing the quantum cobwebs." reload />}
      {power === 'shutdown' && (
        <PowerOverlay
          label="SHUTTING DOWN..."
          sub="Until we meet again, in another dimension."
          onWake={() => {
            setPower('none');
            Sound.startup();
            os.notify('Woke up', 'The portal yawns open. Nice nap?', '🌅');
          }}
        />
      )}
    </div>
  );
}