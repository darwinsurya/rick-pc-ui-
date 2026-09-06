import type { AppDef } from '../os/types';
import Terminal from './Terminal';
import Files from './Files';
import Browser from './Browser';
import Editor from './Editor';
import Calculator from './Calculator';
import Notes from './Notes';
import Paint from './Paint';
import CalendarApp from './CalendarApp';
import TaskManager from './TaskManager';
import SysInfo from './SysInfo';
import RecycleBin from './RecycleBin';
import Clicker from './Clicker';
import Weather from './Weather';
import Photos from './Photos';
import Music from './Music';
import ClockApp from './ClockApp';
import Viewer from './Viewer';
import Settings from './Settings';
import MeeseeksBox from './MeeseeksBox';
import InterdimensionalCable from './InterdimensionalCable';
import MortyHomework from './MortyHomework';
import Roy from './Roy';
import SzechuanAnalyzer from './SzechuanAnalyzer';
import DimensionHopper from './DimensionHopper';
import Wanted from './Wanted';

export const APP_REGISTRY: Record<string, AppDef> = {
  terminal: { id: 'terminal', title: 'Terminal', icon: 'fa-terminal', width: 660, height: 400, full: true, component: Terminal },
  files: { id: 'files', title: 'Finder', icon: 'fa-folder-open', width: 760, height: 480, full: true, component: Files },
  browser: { id: 'browser', title: 'Portal Browser', icon: 'fa-globe', width: 820, height: 520, full: true, component: Browser },
  editor: { id: 'editor', title: 'Code Editor', icon: 'fa-code', width: 700, height: 460, full: true, component: Editor },
  calculator: { id: 'calculator', title: 'Calculator', icon: 'fa-calculator', width: 340, height: 500, full: true, component: Calculator },
  notes: { id: 'notes', title: 'Notepad', icon: 'fa-sticky-note', width: 540, height: 420, full: true, component: Notes },
  paint: { id: 'paint', title: 'Paint', icon: 'fa-paint-brush', width: 640, height: 460, full: true, component: Paint },
  calendar: { id: 'calendar', title: 'Calendar', icon: 'fa-calendar-alt', width: 720, height: 480, component: CalendarApp },
  taskmanager: { id: 'taskmanager', title: 'Task Manager', icon: 'fa-tasks', width: 700, height: 480, full: true, component: TaskManager },
  sysinfo: { id: 'sysinfo', title: 'System Info', icon: 'fa-info-circle', width: 620, height: 460, component: SysInfo },
  recycle: { id: 'recycle', title: 'Recycle Bin', icon: 'fa-trash-alt', width: 620, height: 430, full: true, component: RecycleBin, desktop: false },
  clicker: { id: 'clicker', title: 'Clicker', icon: 'fa-hand-pointer', width: 420, height: 420, full: true, component: Clicker },
  weather: { id: 'weather', title: 'Weather', icon: 'fa-cloud-sun', width: 600, height: 430, component: Weather },
  photos: { id: 'photos', title: 'Photos', icon: 'fa-images', width: 680, height: 460, full: true, component: Photos },
  music: { id: 'music', title: 'Music', icon: 'fa-music', width: 460, height: 560, full: true, component: Music },
  clock: { id: 'clock', title: 'Clock', icon: 'fa-clock', width: 380, height: 560, component: ClockApp },
  viewer: { id: 'viewer', title: 'Viewer', icon: 'fa-eye', width: 640, height: 440, full: true, component: Viewer, desktop: false },
  settings: { id: 'settings', title: 'Settings', icon: 'fa-cog', width: 720, height: 480, full: true, component: Settings },
  meeseeks: { id: 'meeseeks', title: 'Meeseeks Box', icon: 'fa-cube', width: 620, height: 500, full: true, component: MeeseeksBox },
  cable: { id: 'cable', title: 'Interdimensional Cable', icon: 'fa-tv', width: 720, height: 540, full: true, component: InterdimensionalCable },
  homework: { id: 'homework', title: "Morty's Homework Help", icon: 'fa-book', width: 640, height: 540, full: true, component: MortyHomework },
  roy: { id: 'roy', title: 'Roy: A Life', icon: 'fa-dice', width: 460, height: 560, full: true, component: Roy, desktop: false },
  szechuan: { id: 'szechuan', title: 'Szechuan Analyzer', icon: 'fa-utensils', width: 560, height: 520, full: true, component: SzechuanAnalyzer },
  hopper: { id: 'hopper', title: 'Dimension Hopper', icon: 'fa-sync', width: 620, height: 520, component: DimensionHopper },
  wanted: { id: 'wanted', title: 'Federation Wanted', icon: 'fa-star', width: 600, height: 540, full: true, component: Wanted, desktop: false },
};