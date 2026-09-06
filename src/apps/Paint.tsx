import { useRef, useState } from 'react';
import { Sound } from '../os/sound';
import type { AppProps } from '../os/types';

const COLORS = ['#00ff41', '#00d4ff', '#ff5252', '#ffd700', '#9b59b6', '#c8f8c2', '#ffffff', '#000000'];

export default function Paint({ windowId }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#00ff41');
  const drawing = useRef(false);

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    c.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = c.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(e.clientX - c.getBoundingClientRect().left, e.clientY - c.getBoundingClientRect().top);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.lineTo(e.clientX - c.getBoundingClientRect().left, e.clientY - c.getBoundingClientRect().top);
    ctx.stroke();
  };

  const stop = () => { drawing.current = false; };

  const clear = () => {
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const save = () => {
    Sound.success();
    const url = canvasRef.current!.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citadel-masterpiece.png';
    a.click();
  };

  void windowId;

  return (
    <div className="paint">
      <div className="paint-tools">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`paint-color ${c === color ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => {
              Sound.click();
              setColor(c);
            }}
          />
        ))}
        <button className="paint-clear" onClick={clear}><i className="fas fa-eraser" /></button>
        <button className="paint-save" onClick={save}><i className="fas fa-download" /></button>
      </div>
      <div className="paint-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={560}
          height={360}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={stop}
          onPointerLeave={stop}
        />
      </div>
    </div>
  );
}