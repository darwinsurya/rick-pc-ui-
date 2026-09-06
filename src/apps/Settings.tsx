import { useState } from 'react';
import { useOs } from '../os/store';
import { WALLPAPERS } from '../os/types';
import { Sound } from '../os/sound';
import { USERS } from '../os/users';
import type { AppProps } from '../os/types';

const ACCENTS = ['#00ff41', '#00d4ff', '#ff5252', '#ffd700', '#9b59b6', '#ff7b00', '#0af'];

type Tab = 'person' | 'sound' | 'system';

export default function Settings({ windowId }: AppProps) {
  const os = useOs();
  void windowId;
  const [tab, setTab] = useState<Tab>('person');

  const s = os.settings;
  const uptimeMin = Math.max(1, Math.round((Date.now() - os.bootTime) / 60000));

  const switchTab = (t: Tab) => {
    Sound.click();
    setTab(t);
  };

  const resetData = () => {
    if (!window.confirm('Purge CITADEL OS data? (settings, profile, wanted record)')) return;
    Sound.powerOff();
    try {
      ['rm-settings', 'rm-user', 'rm-wanted', 'rm-recent', 'rm-notes', 'rm-alarms', 'rm-fs-tree', 'rm-fs-bin'].forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  return (
    <div className="settings">
      <div className="settings-side">
        <button className={tab === 'person' ? 'set-active' : ''} onClick={() => switchTab('person')}>
          <i className="fas fa-palette" /> Personalization
        </button>
        <button className={tab === 'sound' ? 'set-active' : ''} onClick={() => switchTab('sound')}>
          <i className="fas fa-volume-up" /> Sound
        </button>
        <button className={tab === 'system' ? 'set-active' : ''} onClick={() => switchTab('system')}>
          <i className="fas fa-shield-alt" /> System
        </button>
      </div>
      <div className="settings-main">
        {tab === 'person' && (
          <>
            <h2>Personalization</h2>

            <div className="set-group">
              <b>Sign in as</b>
              <div className="set-users">
                {USERS.map((u) => (
                  <button
                    key={u.id}
                    className={`set-user ${os.user.id === u.id ? 'active' : ''}`}
                    style={{ ['--uaccent' as string]: u.accent }}
                    onClick={() => {
                      Sound.success();
                      os.setUser(u.id);
                    }}
                  >
                    <i className={`fas ${u.icon}`} />
                    <span>{u.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="set-group">
              <b>Accent color</b>
              <div className="set-accents">
                {ACCENTS.map((a) => (
                  <button
                    key={a}
                    className={`swatch ${s.accent === a ? 'active' : ''}`}
                    style={{ background: a }}
                    onClick={() => {
                      Sound.success();
                      os.updateSettings({ accent: a });
                    }}
                    title={a}
                  />
                ))}
              </div>
            </div>

            <div className="set-group">
              <b>Wallpaper</b>
              <div className="set-walls">
                {WALLPAPERS.map((w, i) => (
                  <button
                    key={w.name}
                    className={`set-wall ${s.wallpaper === i ? 'active' : ''}`}
                    style={{ background: w.css }}
                    onClick={() => {
                      Sound.success();
                      os.updateSettings({ wallpaper: i });
                    }}
                  >
                    <span>{w.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="set-row">
              <div><b>Desktop widgets</b><span>Keep the essentials on the desktop at all times.</span></div>
              <label className="switch">
                <input type="checkbox" checked={s.showWidgets} onChange={() => os.updateSettings({ showWidgets: !s.showWidgets })} />
                <span className="switch-slider" />
              </label>
            </div>
          </>
        )}

        {tab === 'sound' && (
          <>
            <h2>Sound</h2>

            <div className="set-row">
              <div><b>Master sound</b><span>Global on/off — the whole orchestra.</span></div>
              <label className="switch">
                <input type="checkbox" checked={s.soundEnabled} onChange={() => os.updateSettings({ soundEnabled: !s.soundEnabled })} />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="set-row">
              <div><b>UI click sounds</b><span>Pleasant beeps as you poke at reality.</span></div>
              <label className="switch">
                <input type="checkbox" checked={s.uiClick} onChange={() => os.updateSettings({ uiClick: !s.uiClick })} />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="set-row">
              <div><b>Ambient music</b><span>Schwifty radio in the background.</span></div>
              <label className="switch">
                <input type="checkbox" checked={s.music} onChange={() => os.updateSettings({ music: !s.music })} />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="set-group">
              <b>Volume {s.volume}%</b>
              <input
                type="range"
                min={0}
                max={100}
                value={s.volume}
                onChange={(e) => os.updateSettings({ volume: Number(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            <div className="set-note">
              <i className="fas fa-wave-square" />
              <span>Test beep: </span>
              <button onClick={() => { Sound.success(); Sound.click(); }}>beep</button>
            </div>
          </>
        )}

        {tab === 'system' && (
          <>
            <h2>System</h2>

            <div className="set-sysbox">
              <div className="sys-row"><span>OS</span><b>CITADEL OS</b></div>
              <div className="sys-row"><span>Version</span><b>v2.0 “Wubba”</b></div>
              <div className="sys-row"><span>Dimension</span><b>{WALLPAPERS[s.wallpaper].name}</b></div>
              <div className="sys-row"><span>User</span><b>{os.user.name}</b></div>
              <div className="sys-row"><span>Wanted level</span><b>{os.wantedLevel} / 8</b></div>
              <div className="sys-row"><span>Session time</span><b>~{uptimeMin} min</b></div>
              <div className="sys-row"><span>Kernel</span><b>PortalOS 3.1 (guaranteed non-sentient)</b></div>
            </div>

            <div className="set-group">
              <b>Persisted data</b>
              <p className="set-clear-note">Settings, your profile and the Federation wanted record are stored locally in this browser.</p>
              <button className="set-reset" onClick={resetData}>
                <i className="fas fa-trash-alt" /> Purge & reboot
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}