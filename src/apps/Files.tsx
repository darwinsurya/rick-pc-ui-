import { useState } from 'react';
import { FS, type FsNode } from '../os/files';
import { Sound } from '../os/sound';
import { send } from '../os/channel';
import type { AppProps } from '../os/types';
import { useOs } from '../os/store';

const SIDEROOTS = ['Home', 'Desktop', 'Documents', 'Downloads', 'Pictures', 'System'];

function nodeIcon(n: FsNode) {
  if (n.type === 'folder') return 'fa-folder';
  return n.icon || 'fa-file-alt';
}

export default function Files({ windowId }: AppProps) {
  const os = useOs();
  const [path, setPath] = useState<string[]>(FS.pathParts());
  const [sel, setSel] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const entries = () => {
    const kids = FS.current().children || {};
    return Object.entries(kids).sort(([a], [b]) => {
      const A = kids[a];
      const B = kids[b];
      if (A.type !== B.type) return A.type === 'folder' ? -1 : 1;
      return a.localeCompare(b);
    });
  };

  const results = query.trim() ? FS.find(query) : [];

  const flashToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600);
  };

  const go = (parts: string[]) => {
    FS.upToRoot();
    if (FS.cd(parts)) setPath(FS.pathParts());
    else {
      FS.upToRoot();
      flashToast('That folder only exists in a parallel dimension.');
    }
  };

  const up = () => {
    if (path.length > 1) go(path.slice(0, -1));
  };

  const open = (name: string, node: FsNode) => {
    Sound.click();
    if (node.type === 'folder') {
      go([...path.slice(1), name]);
    } else if (node.text !== undefined) {
      if (node.icon === 'fa-file-image') {
        send('viewer', { name, text: node.text });
        os.openApp('viewer');
      } else {
        send('editor', { name, text: node.text });
        os.openApp('editor');
      }
    } else {
      os.notify('File Viewer', `${name} — no compatible viewer in this dimension.`, '📄');
    }
  };

  const openResult = (p: string) => {
    const parts = p.split('/').filter(Boolean);
    const node = FS.fsNodeAt(parts);
    if (!node) return;
    setQuery('');
    setSel(null);
    if (node.type === 'folder') {
      go(parts);
    } else {
      const name = parts[parts.length - 1];
      if (parts.length > 1) go(parts.slice(0, -1));
      open(name, node);
    }
  };

  const del = () => {
    if (!sel) return;
    const item = FS.deleteItem(sel);
    if (item) {
      os.notify('Garbage Dimension', `${sel} moved to the recycle bin.`, '🗑️');
      Sound.error();
      setSel(null);
      setPath([...path]);
    }
  };

  const mkdir = () => {
    const name = prompt('New folder name:')?.trim();
    if (!name) return;
    if (FS.mkdir(name)) {
      setPath([...path]);
    } else os.notify('Error', 'Folder already exists.', '⚠️');
  };

  const mkfile = () => {
    const name = prompt('New text file name:')?.trim();
    if (!name) return;
    if (FS.writeFile(name, '')) {
      Sound.success();
      setPath([...path]);
    } else os.notify('Error', 'File already exists.', '⚠️');
  };

  const rename = () => {
    if (!sel) return;
    const next = prompt('New name:', sel)?.trim();
    if (!next || next === sel) return;
    if (FS.renameItem(sel, next)) {
      Sound.success();
      setSel(null);
      setPath([...path]);
    } else os.notify('Error', 'Could not rename — that name already exists.', '⚠️');
  };

  void windowId;

  return (
    <div className="fm">
      <aside className="fm-sidebar">
        {SIDEROOTS.map((r) => (
          <button
            key={r}
            className={`fm-sideroot ${path.join('/') === r ? 'active' : ''}`}
            onClick={() => go(r === 'Home' ? [] : [r])}
          >
            <i className="fas fa-folder" /> {r}
          </button>
        ))}
        <div className="fm-sidegap">
          <button onClick={() => { os.openApp('recycle'); setSel(null); }}>
            <i className="fas fa-trash" /> Recycle Bin
          </button>
        </div>
      </aside>

      <div className="fm-main">
        <div className="fm-toolbar">
          <button onClick={up} disabled={path.length <= 1} title="Up one level">
            <i className="fas fa-arrow-up" />
          </button>
          <button onClick={mkdir} title="New folder">
            <i className="fas fa-folder-plus" />
          </button>
          <button onClick={mkfile} title="New text file">
            <i className="fas fa-file-plus" />
          </button>
          <button onClick={rename} disabled={!sel} title="Rename">
            <i className="fas fa-i-cursor" />
          </button>
          <button onClick={del} disabled={!sel} title="Delete">
            <i className="fas fa-trash-alt" />
          </button>
          <div className="fm-search">
            <i className="fas fa-search" />
            <input
              value={query}
              placeholder="Find files across the multiverse..."
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="fm-searchclear" title="Clear" onClick={() => setQuery('')}>
                <i className="fas fa-times" />
              </button>
            )}
          </div>
          <div className="fm-crumbs">
            <span onClick={() => go([])}>💀 Home</span>
            {path.slice(1).map((p, i) => (
              <span key={p}>
                <i className="fas fa-chevron-right" />
                <b onClick={() => go(path.slice(0, i + 2))}>{p}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="fm-content">
          {toast && <div className="fm-toast">{toast}</div>}

          {query.trim() ? (
            results.length === 0 ? (
              <div className="fm-empty">
                <i className="fas fa-user-astronaut" />
                <p>No files match “{query}”. Not in this dimension.</p>
              </div>
            ) : (
              <div className="fm-search-list">
                {results.map((r, i) => (
                  <div key={i} className="fm-search-hit" onClick={() => openResult(r.path)}>
                    <i className={`fas ${r.kind === 'folder' ? 'fa-folder' : 'fa-file-alt'}`} />
                    <b>{r.name}</b>
                    <span>{r.path}</span>
                  </div>
                ))}
              </div>
            )
          ) : entries().length === 0 ? (
            <div className="fm-empty">
              <i className="fas fa-ghost" />
              <p>This folder is emptier than a Blitz and Chitz walk-in.</p>
            </div>
          ) : (
            <div className="fm-grid">
              {entries().map(([name, node]) => (
                <div
                  key={name}
                  className={`fm-item ${sel === name ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSel(name);
                  }}
                  onDoubleClick={() => open(name, node)}
                >
                  <i className={`fas ${nodeIcon(node)}`} />
                  <span>{name}</span>
                  {node.type === 'file' && node.size && <small>{node.size}</small>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}