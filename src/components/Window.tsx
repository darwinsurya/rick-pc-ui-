import { useEffect, useRef, useState } from 'react';
import { useOs } from '../os/store';
import type { OsWindow } from '../os/types';
import { TASKBAR_HEIGHT } from '../os/types';
import { Sound } from '../os/sound';

interface Pos {
  x: number;
  y: number;
}
interface Size {
  w: number;
  h: number;
}
type SnapSide = 'left' | 'right' | null;

export default function Window({ w }: { w: OsWindow }) {
  const os = useOs();
  const active = os.activeId === w.id;
  const vw = window.innerWidth;
  const vh = window.innerHeight - TASKBAR_HEIGHT;

  const [pos, setPos] = useState<Pos>({ x: w.x, y: w.y });
  const [size, setSize] = useState<Size>({ w: w.w, h: w.h });
  const [snap, setSnap] = useState<SnapSide>(null);
  const dragging = useRef(false);
  const doSnap = useRef<SnapSide>(null);
  const start = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    setPos({ x: w.x, y: w.y });
    setSize({ w: w.w, h: w.h });
  }, [w.x, w.y, w.w, w.h]);

  const def = os.appList[w.appId] ?? null;

  const beginDrag = (e: React.PointerEvent) => {
    if (w.maximized) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    start.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    setSnap(null);
  };

  const dragMove = (e: React.PointerEvent) => {
    if (!dragging.current || !start.current) return;
    const nx = start.current.ox + (e.clientX - start.current.sx);
    const ny = Math.max(0, Math.min(start.current.oy + (e.clientY - start.current.sy), vh - 40));
    setPos({ x: nx, y: ny });
    const side: SnapSide = vw > 720 && nx < 14 ? 'left' : vw > 720 && nx + size.w > vw - 14 ? 'right' : null;
    setSnap(side);
    doSnap.current = side;
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (doSnap.current === 'left') {
      os.setWindowRect(w.id, { x: 0, y: 0, w: Math.round(vw / 2), h: vh });
      Sound.maximize();
    } else if (doSnap.current === 'right') {
      os.setWindowRect(w.id, { x: Math.round(vw / 2), y: 0, w: Math.round(vw / 2), h: vh });
      Sound.maximize();
    } else {
      os.moveWindow(w.id, pos.x, pos.y);
    }
    doSnap.current = null;
    setSnap(null);
  };

  const beginResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
    start.current = { sx: e.clientX, sy: e.clientY, ox: size.w, oy: size.h };
  };

  const resizeMove = (e: React.PointerEvent) => {
    if (!dragging.current || !start.current) return;
    const nw = Math.max(320, Math.min(vw - pos.x - 10, start.current.ox + (e.clientX - start.current.sx)));
    const nh = Math.max(240, Math.min(vh - pos.y - 10, start.current.oy + (e.clientY - start.current.sy)));
    setSize({ w: nw, h: nh });
  };

  const endResize = () => {
    if (!dragging.current) return;
    dragging.current = false;
    os.resizeWindow(w.id, size.w, size.h);
  };

  const style: React.CSSProperties = {};
  if (w.maximized) {
    style.left = 0;
    style.top = 0;
    style.width = vw;
    style.height = vh;
  } else {
    style.left = pos.x;
    style.top = pos.y;
    style.width = size.w;
    style.height = size.h;
  }
  style.zIndex = w.z;

  return (
    <>
      {snap && dragging.current && <div className="snap-overlay" />}
      <div
        className={`window ${active ? 'focused' : ''} ${snap ? `snap-${snap}` : ''} ${w.maximized ? 'maximized' : ''}`}
        style={style}
        onPointerDown={() => os.focusWindow(w.id)}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <div className="win-bar" onPointerDown={beginDrag} onPointerMove={dragMove} onPointerUp={endDrag}>
          <span className="win-title">
            <i className={`fas ${w.icon}`} />
            {os.windowLabel(w)}
          </span>
          <div className="win-controls">
            <button title="Minimize" onClick={() => os.minimizeWindow(w.id)}>
              <i className="far fa-window-minimize" />
            </button>
            <button title={w.maximized ? 'Restore' : 'Maximize'} onClick={() => os.toggleMaximize(w.id)}>
              <i className={`far ${w.maximized ? 'fa-window-restore' : 'fa-window-maximize'}`} />
            </button>
            <button className="win-close" title="Close" onClick={() => os.closeWindow(w.id)}>
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
        <div className={`win-body ${def?.full ? 'full' : ''}`}>
          {def ? <def.component windowId={w.id} /> : <div className="win-placeholder">Component missing.</div>}
        </div>
        {!w.maximized && (
          <div className="win-resizer" onPointerDown={beginResize} onPointerMove={resizeMove} onPointerUp={endResize} />
        )}
      </div>
    </>
  );
}