import { useState } from 'react';
import { FS, type DeletedItem } from '../os/files';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import type { AppProps } from '../os/types';

export default function RecycleBin({ windowId }: AppProps) {
  const os = useOs();
  const [items, setItems] = useState<DeletedItem[]>(FS.bin());
  const [, force] = useState(0);
  void windowId;

  const refresh = () => {
    setItems(FS.bin());
    force((k) => k + 1);
  };

  const restore = (it: DeletedItem) => {
    if (FS.restore(it.id)) {
      Sound.success();
      os.notify('Restored', `${it.name} is back in the wanted universe.`, '♻️');
    }
    refresh();
  };

  const empty = () => {
    if (!items.length) return;
    FS.emptyBin();
    Sound.error();
    os.notify('Garbage Dimension', 'Permanently expunged. Anything else you want gone?', '🗑️');
    refresh();
  };

  return (
    <div className="rb">
      <div className="rb-head">
        <div>
          <i className="fas fa-trash-alt" />
          <b>Recycle Bin · Garbage Dimension</b>
        </div>
        <button onClick={empty} disabled={!items.length}><i className="fas fa-dumpster" /> Empty bin</button>
      </div>
      {items.length === 0 ? (
        <div className="rb-empty">
          <i className="fas fa-ghost" />
          <p>All clean. Not even a stray alternate-timeline sock in here.</p>
        </div>
      ) : (
        <div className="rb-list">
          {items.map((it) => (
            <div className="rb-item" key={it.id}>
              <i className={`fas ${it.icon || 'fa-file-alt'}`} />
              <b>{it.name}</b>
              <span className="dim">{it.path} · {it.size || '?'}</span>
              <button onClick={() => restore(it)}><i className="fas fa-undo-alt" /> Restore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}