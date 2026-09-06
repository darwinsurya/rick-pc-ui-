import type { ComponentType } from 'react';

export interface AppDef {
  id: string;
  title: string;
  icon: string;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  desktop?: boolean;
  full?: boolean;
  component: ComponentType<AppProps>;
}

export interface AppProps {
  windowId: number;
}

export interface OsWindow {
  id: number;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  maximized: boolean;
  z: number;
  prev?: { x: number; y: number; w: number; h: number } | null;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  icon: string;
  time: number;
}

export interface Settings {
  soundEnabled: boolean;
  uiClick: boolean;
  music: boolean;
  accent: string;
  wallpaper: number;
  showWidgets: boolean;
  volume: number;
}

export interface Crime {
  id: number;
  label: string;
  level: number;
  time: number;
}

export interface Wallpaper {
  name: string;
  css: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    name: 'C-137 Nebula',
    css: 'radial-gradient(ellipse at 30% 35%, #0f6b37 0%, #03100a 60%), radial-gradient(circle at 78% 22%, rgba(0,255,65,0.16), transparent 40%)',
  },
  {
    name: 'Citadel of Ricks',
    css: 'linear-gradient(172deg, #06121a 0%, #0c3140 45%, #06121a 100%), radial-gradient(circle at 50% 8%, rgba(0,212,255,0.5) 0%, transparent 42%)',
  },
  {
    name: 'Gazorpazorp',
    css: 'linear-gradient(160deg, #14081c 0%, #4a1352 55%, #14081c 100%), radial-gradient(circle at 70% 30%, rgba(155,89,182,0.35), transparent 45%)',
  },
  {
    name: 'Blips & Chitz',
    css: 'repeating-linear-gradient(45deg, rgba(0,255,65,0.05) 0 14px, transparent 14px 28px), radial-gradient(ellipse at 50% 20%, #0a3f22 0%, #04100a 70%)',
  },
  {
    name: 'Purge Planet',
    css: 'radial-gradient(circle at 50% 76%, #5a1012 0%, #140303 55%), radial-gradient(circle at 42% 60%, rgba(255,82,82,0.45), transparent 35%)',
  },
  {
    name: 'Atlantis',
    css: 'linear-gradient(180deg, #021625 0%, #062c4a 50%, #03121e 100%), radial-gradient(circle at 20% 30%, rgba(0,212,255,0.3), transparent 40%)',
  },
];

export const TASKBAR_HEIGHT = 50;