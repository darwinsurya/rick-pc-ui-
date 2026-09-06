import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { AppDef, Crime, NotificationItem, OsWindow, Settings } from './types';
import { TASKBAR_HEIGHT } from './types';
import { Sound } from './sound';
import { rickGreeting } from './quotes';
import { getUser, type OsUser } from './users';

let registry: Record<string, AppDef> | null = null;
export function setRegistry(r: Record<string, AppDef>) {
  registry = r;
}
export function getRegistry(): Record<string, AppDef> {
  return registry ?? {};
}

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  uiClick: true,
  music: false,
  accent: '#00ff41',
  wallpaper: 0,
  showWidgets: true,
  volume: 70,
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem('rm-settings');
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS };
}

function applyAccent(color: string) {
  document.documentElement.style.setProperty('--accent', color);
}

interface OsApi {
  windows: OsWindow[];
  activeId: number | null;
  notifications: NotificationItem[];
  toasts: NotificationItem[];
  settings: Settings;
  bootTime: number;
  recentApps: string[];
  appList: Record<string, AppDef>;
  user: OsUser;
  setUser: (id: string) => void;
  wantedLevel: number;
  crimes: Crime[];
  addCrime: (label: string) => void;
  clearCrimes: () => void;
  netOn: boolean;
  toggleNet: () => void;
  openApp: (appId: string) => number | null;
  focusWindow: (id: number) => void;
  closeWindow: (id: number) => void;
  minimizeWindow: (id: number) => void;
  restoreWindow: (id: number) => void;
  toggleMaximize: (id: number) => void;
  showDesktop: () => void;
  moveWindow: (id: number, x: number, y: number) => void;
  resizeWindow: (id: number, w: number, h: number) => void;
  setWindowRect: (id: number, rect: { x: number; y: number; w: number; h: number; maximized?: boolean }) => void;
  notify: (title: string, message: string, icon?: string, ttl?: number) => void;
  dismissToast: (id: number) => void;
  dismissNotification: (id: number) => void;
  clearNotifications: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setBootTime: (t: number) => void;
  windowLabel: (w: OsWindow) => string;
}

const OsContext = createContext<OsApi | null>(null);

export function useOs(): OsApi {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error('useOs must be used within OsProvider');
  return ctx;
}

let notifId = 1;

export function OsProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<OsWindow[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<NotificationItem[]>([]);
  const [settings, setSettingsState] = useState<Settings>(() => {
    const s = loadSettings();
    applyAccent(s.accent);
    Sound.setEnabled(s.soundEnabled);
    Sound.setUIEnabled(s.uiClick);
    Sound.setVolume(s.volume);
    return s;
  });
  const [bootTime, setBootTime] = useState(() => Date.now());
  const [recentApps, setRecentApps] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rm-recent') || '[]');
    } catch {
      return [];
    }
  });
  const [userId, setUserId] = useState<string>(() => {
    try {
      return localStorage.getItem('rm-user') || 'rick';
    } catch {
      return 'rick';
    }
  });
  const [crimes, setCrimes] = useState<Crime[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rm-wanted') || '[]');
    } catch {
      return [];
    }
  });
  const [netOn, setNetOn] = useState(true);

  const zCounter = useRef(10);
  const winIdCounter = useRef(0);

  const focusWindow = useCallback((id: number) => {
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id === id) {
          const z = ++zCounter.current;
          return { ...w, z };
        }
        return { ...w };
      }),
    );
    setActiveId(id);
  }, []);

  const defaultRect = useCallback((def: AppDef) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - TASKBAR_HEIGHT;
    const w = Math.min(def.width + 40, vw - 24);
    const h = Math.min(def.height + 40, vh - 20);
    const n = Math.min(winIdCounter.current % 6, 5);
    const buffer = 24;
    const x = Math.max(8, Math.min(vw - w - 10, buffer + n * 32));
    const y = Math.max(8, Math.min(vh - h - 10, buffer + n * 24));
    return { x, y, w, h };
  }, []);

  const openApp = useCallback(
    (appId: string): number | null => {
      const reg = getRegistry();
      const def = reg[appId];
      if (!def) return null;
      const existing = windows.find((w) => w.appId === appId);
      if (existing && windows.find((w) => w.id === existing.id)) {
        focusWindow(existing.id);
        return existing.id;
      }
      Sound.windowOpen();
      const id = ++winIdCounter.current;
      const rect = defaultRect(def);
      const win: OsWindow = {
        id,
        appId,
        title: def.title,
        icon: def.icon,
        ...rect,
        minimized: false,
        maximized: false,
        z: ++zCounter.current,
        prev: null,
      };
      setWindows((ws) => [...ws, win]);
      setActiveId(id);
      setRecentApps((rec) => {
        const next = [appId, ...rec.filter((a) => a !== appId)].slice(0, 8);
        try {
          localStorage.setItem('rm-recent', JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      return id;
    },
    [windows, focusWindow, defaultRect],
  );

  const closeWindow = useCallback((id: number) => {
    Sound.windowClose();
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const minimizeWindow = useCallback((id: number) => {
    Sound.minimize();
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const restoreWindow = useCallback(
    (id: number) => {
      focusWindow(id);
      setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: false } : w)));
    },
    [focusWindow],
  );

  const toggleMaximize = useCallback((id: number) => {
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        if (!w.maximized) {
          Sound.maximize();
          return { ...w, maximized: true, prev: { x: w.x, y: w.y, w: w.w, h: w.h } };
        }
        Sound.minimize();
        const p = w.prev || { x: 40, y: 40, w: 520, h: 420 };
        return { ...w, maximized: false, ...p };
      }),
    );
  }, []);

  const showDesktop = useCallback(() => {
    Sound.click();
    setWindows((ws) => ws.map((w) => ({ ...w, minimized: true })));
    setActiveId(null);
  }, []);

  const moveWindow = useCallback((id: number, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback((id: number, w: number, h: number) => {
    setWindows((ws) => ws.map((win) => (win.id === id ? { ...win, w, h } : win)));
  }, []);

  const setWindowRect = useCallback((id: number, rect: { x: number; y: number; w: number; h: number; maximized?: boolean }) => {
    setWindows((ws) =>
      ws.map((w) =>
        w.id === id
          ? {
              ...w,
              x: rect.x,
              y: rect.y,
              w: rect.w,
              h: rect.h,
              maximized: rect.maximized ?? w.maximized,
              prev: null,
            }
          : w,
      ),
    );
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (title: string, message: string, icon = '🧠', ttl = 5000) => {
      const item: NotificationItem = { id: notifId++, title, message, icon, time: Date.now() };
      setNotifications((ns) => [item, ...ns].slice(0, 30));
      setToasts((ts) => [...ts.slice(-4), item]);
      Sound.success();
      window.setTimeout(() => dismissToast(item.id), ttl);
    },
    [dismissToast],
  );

  const dismissNotification = useCallback((id: number) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((s) => {
      const next = { ...s, ...patch };
      try {
        localStorage.setItem('rm-settings', JSON.stringify(next));
      } catch {
        /* ignore */
      }
      if (patch.accent) applyAccent(patch.accent);
      if (patch.soundEnabled !== undefined) Sound.setEnabled(patch.soundEnabled);
      if (patch.uiClick !== undefined) Sound.setUIEnabled(patch.uiClick);
      if (patch.volume !== undefined) Sound.setVolume(patch.volume);
      if (patch.music !== undefined) {
        if (patch.music) Sound.startMusic();
        else Sound.stopMusic();
      }
      return next;
    });
  }, []);

  const windowLabel = useCallback((w: OsWindow) => {
    return getRegistry()[w.appId]?.title ?? w.title;
  }, []);

  const user = getUser(userId);

  const setUser = useCallback(
    (id: string) => {
      const u = getUser(id);
      setUserId(id);
      try {
        localStorage.setItem('rm-user', id);
      } catch {
        /* ignore */
      }
      updateSettings({ accent: u.accent });
      Sound.success();
    },
    [updateSettings],
  );

  const addCrime = useCallback(
    (label: string) => {
      setCrimes((prev) => {
        const next = [{ id: Date.now(), label, level: Math.min(8, prev.length + 1), time: Date.now() }, ...prev].slice(0, 8);
        try {
          localStorage.setItem('rm-wanted', JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      Sound.error();
    },
    [],
  );

  const clearCrimes = useCallback(() => {
    setCrimes([]);
    try {
      localStorage.removeItem('rm-wanted');
    } catch {
      /* ignore */
    }
    Sound.success();
    window.setTimeout(() => {
      notify('Laying low', 'Wanted level reset. The Galactic Federation thanks you for your cooperation.', '🛸');
    }, 900);
  }, [notify]);

  const toggleNet = useCallback(() => {
    setNetOn((on) => {
      const next = !on;
      Sound.windowOpen();
      return next;
    });
  }, []);

  const api = useMemo<OsApi>(
    () => ({
      windows,
      activeId,
      notifications,
      toasts,
      settings,
      bootTime,
      recentApps,
      appList: getRegistry(),
      user,
      setUser,
      wantedLevel: crimes.length,
      crimes,
      addCrime,
      clearCrimes,
      netOn,
      toggleNet,
      openApp,
      focusWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      showDesktop,
      moveWindow,
      resizeWindow,
      setWindowRect,
      notify,
      dismissToast,
      dismissNotification,
      clearNotifications,
      updateSettings,
      setBootTime,
      windowLabel,
    }),
    [
      windows,
      activeId,
      notifications,
      toasts,
      settings,
      bootTime,
      recentApps,
      user,
      crimes,
      setUser,
      addCrime,
      clearCrimes,
      toggleNet,
      openApp,
      focusWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      showDesktop,
      moveWindow,
      resizeWindow,
      setWindowRect,
      notify,
      dismissToast,
      dismissNotification,
      clearNotifications,
      updateSettings,
      windowLabel,
    ],
  );

  return <OsContext.Provider value={api}>{children}</OsContext.Provider>;
}

export function welcomeMessage() {
  return `${rickGreeting()} Welcome to C-137. Don't touch anything.`;
}