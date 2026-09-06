import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface MenuItem {
  icon: string;
  label: string;
  action: () => void;
}

interface Props {
  x: number;
  y: number;
  items: MenuItem[];
  items2?: MenuItem[];
  sep?: boolean;
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, items2, sep, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  useLayoutEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (r) {
      setPos({
        x: Math.min(x, window.innerWidth - r.width - 8),
        y: Math.min(y, window.innerHeight - r.height - 8),
      });
    }
  }, [x, y]);

  useEffect(() => {
    const close = () => onClose();
    document.addEventListener('pointerdown', close);
    window.addEventListener('blur', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      window.removeEventListener('blur', close);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="cm-menu"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {items.map((it) => (
        <button
          key={it.label}
          onClick={() => {
            it.action();
            onClose();
          }}
        >
          <i className={`fas ${it.icon}`} />
          {it.label}
        </button>
      ))}
      {sep && items2 && <div className="cm-sep" />}
      {items2?.map((it) => (
        <button
          key={it.label}
          onClick={() => {
            it.action();
            onClose();
          }}
        >
          <i className={`fas ${it.icon}`} />
          {it.label}
        </button>
      ))}
    </div>
  );
}