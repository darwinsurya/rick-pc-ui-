export interface FsNode {
  type: 'folder' | 'file';
  icon: string;
  size?: string;
  text?: string;
  children?: Record<string, FsNode>;
}

export interface DeletedItem extends FsNode {
  id: number;
  name: string;
  path: string;
}

let idCounter = 1;

function cloneTree(t: Record<string, FsNode>): Record<string, FsNode> {
  return JSON.parse(JSON.stringify(t));
}

export const initialTree: Record<string, FsNode> = {
  Desktop: {
    type: 'folder',
    icon: 'fa-folder',
    children: {
      'portal-gun.exe': {
        type: 'file',
        icon: 'fa-file-code',
        size: '2.4 MB',
        text: 'EXECUTABLE: Runs the portal gun service.\nDo not run while drunk. Running while drunk may cause a portal to your ex-wife\'s house.',
      },
      'clippy.txt': {
        type: 'file',
        icon: 'fa-file-alt',
        size: '12 KB',
        text: 'Hi! I\'m Clippy... from Dimension 3Q-38. I\'m here to help you do absolutely nothing useful.',
      },
      'wubba-lubba.txt': { type: 'file', icon: 'fa-file-alt', size: '1 KB', text: 'Wubba Lubba Dub Dub' },
    },
  },
  Documents: {
    type: 'folder',
    icon: 'fa-folder',
    children: {
      'notes.txt': {
        type: 'file',
        icon: 'fa-file-alt',
        size: '4 KB',
        text: 'Experiment log - Day 1:\nCreated a sentient clone by accident. Again.\nDay 2: Clone demanded portal gun.\nDay 3: Gave clone MY portal gun because I was bored.\nDay 4: Cloned the clone. Massive legal trouble.',
      },
      'morty-homework': {
        type: 'folder',
        icon: 'fa-folder',
        children: {
          'biology.pdf': {
            type: 'file',
            icon: 'fa-file-pdf',
            size: '220 KB',
            text: 'lab.docx, but actually just drawings of Mr. Poopybutthole',
          },
          'incomplete.txt': { type: 'file', icon: 'fa-file-alt', size: '0 KB', text: '(empty — as always, Morty)' },
        },
      },
      'secret-plans': {
        type: 'folder',
        icon: 'fa-folder',
        children: {
          'evil-rick.txt': {
            type: 'file',
            icon: 'fa-file-alt',
            size: '33 KB',
            text: 'PLANS FOR DIMENSION 79-D:\nStep 1: Get a juicer.\nStep 2: What the hell, why is there a juicer here.\nStep 3: I came up with this plan while juicing.',
          },
          'do-not-open.txt': {
            type: 'file',
            icon: 'fa-file-alt',
            size: '1 KB',
            text: 'TOLD YOU NOT TO OPEN THIS. (It\'s just a picture of my therapist)',
          },
        },
      },
    },
  },
  Downloads: {
    type: 'folder',
    icon: 'fa-folder',
    children: {
      'alien-tech.zip': {
        type: 'file',
        icon: 'fa-file-archive',
        size: '84 MB',
        text: 'ZIP ARCHIVE: Contains a working starship drive. And 4,000 cat pictures. None of the cats are from this dimension.',
      },
      'get-schwifty.mp3': {
        type: 'file',
        icon: 'fa-file-audio',
        size: '5 MB',
        text: 'AUDIO: "Get Schwifty" — you already know the words, and you will sing them.',
      },
      'monster-trash.jpg': {
        type: 'file',
        icon: 'fa-file-image',
        size: '2 MB',
        text: 'IMAGE: A very normal, completely non-suspicious photo of the family.',
      },
    },
  },
  Pictures: {
    type: 'folder',
    icon: 'fa-folder',
    children: {
      'dimension-view.jpg': {
        type: 'file',
        icon: 'fa-file-image',
        size: '3 MB',
        text: 'IMAGE: Local view of a planet that looks like a butt. Yes, really.',
      },
      'family.png': { type: 'file', icon: 'fa-file-image', size: '1 MB', text: 'IMAGE: "Family" — it\'s complicated.' },
    },
  },
  System: {
    type: 'folder',
    icon: 'fa-folder',
    children: {
      'source-code': {
        type: 'folder',
        icon: 'fa-folder',
        children: {
          'auth.js': { type: 'file', icon: 'fa-file-code', size: '8 KB', text: 'export const password = "wubbalubba";' },
          'rick.module.ts': {
            type: 'file',
            icon: 'fa-file-code',
            size: '42 KB',
            text: 'export class Genius {\n  constructor() { this.motivation = 0; }\n  drink() { return "Schwifty"; }\n}',
          },
          'thin-air.exe': { type: 'file', icon: 'fa-file-code', size: '0 KB', text: '' },
        },
      },
    },
  },
};

const TREE_KEY = 'rm-fs-tree';
const BIN_KEY = 'rm-fs-bin';

function iconForFile(name: string): string {
  if (/\.(jpe?g|png|gif|webp)$/i.test(name)) return 'fa-file-image';
  if (/\.(mp3|wav|ogg)$/i.test(name)) return 'fa-file-audio';
  if (/\.(zip|rar|7z)$/i.test(name)) return 'fa-file-archive';
  if (/\.(pdf)$/i.test(name)) return 'fa-file-pdf';
  if (/\.(js|ts|jsx|tsx|html|css|json)$/i.test(name)) return 'fa-file-code';
  return 'fa-file-alt';
}

export class FileSystem {
  private tree: Record<string, FsNode>;
  private deleted: DeletedItem[] = [];
  private cwd: string[] = ['Home'];

  constructor() {
    this.tree = this.loadTree();
    this.deleted = this.loadBin();
  }

  private loadTree(): Record<string, FsNode> {
    try {
      const raw = localStorage.getItem(TREE_KEY);
      if (raw) {
        const t = JSON.parse(raw);
        if (t && typeof t === 'object' && !Array.isArray(t)) return t as Record<string, FsNode>;
      }
    } catch {
      /* ignore */
    }
    return cloneTree(initialTree);
  }

  private loadBin(): DeletedItem[] {
    try {
      const raw = localStorage.getItem(BIN_KEY);
      if (raw) {
        const b = JSON.parse(raw);
        if (Array.isArray(b)) return b as DeletedItem[];
      }
    } catch {
      /* ignore */
    }
    return [];
  }

  private persist() {
    try {
      localStorage.setItem(TREE_KEY, JSON.stringify(this.tree));
      localStorage.setItem(BIN_KEY, JSON.stringify(this.deleted));
    } catch {
      /* ignore */
    }
  }

  reset() {
    this.tree = cloneTree(initialTree);
    this.deleted = [];
    this.cwd = ['Home'];
    this.persist();
  }

  current(): FsNode {
    let node: FsNode = { type: 'folder', icon: 'fa-folder', children: this.tree };
    for (const p of this.cwd) {
      if (p === 'Home' && !node?.children?.[p]) continue;
      const next = node?.children?.[p];
      if (!next) break;
      node = next;
    }
    return node;
  }

  pathString(): string {
    return '/' + this.cwd.join('/');
  }

  pathParts(): string[] {
    return [...this.cwd];
  }

  parent(): boolean {
    if (this.cwd.length > 1) {
      this.cwd.pop();
      return true;
    }
    return false;
  }

  upToRoot(): void {
    this.cwd = ['Home'];
  }

  fsNodeAt(parts: string[]): FsNode | null {
    let node: FsNode | null = { type: 'folder', icon: 'fa-folder', children: this.tree };
    for (const p of parts) {
      if (p === 'Home' && !node?.children?.[p]) continue;
      node = node && node.type === 'folder' ? node.children?.[p] ?? null : null;
      if (!node) return null;
    }
    return node;
  }

  cd(target: string[]): boolean {
    const rel: string[] = [...this.cwd];
    for (const p of target) {
      if (p === '..') {
        if (rel.length > 1) rel.pop();
      } else if (p === '.' || p === '') {
        /* no-op */
      } else {
        rel.push(p);
      }
    }
    const node = this.fsNodeAt(rel);
    if (node && node.type === 'folder') {
      this.cwd = rel;
      return true;
    }
    return false;
  }

  navigate(depth: number): void {
    this.cwd = this.cwd.slice(0, depth + 1);
  }

  enter(name: string): boolean {
    const target = this.current().children?.[name];
    if (target && target.type === 'folder') {
      this.cwd.push(name);
      return true;
    }
    return false;
  }

  mkdir(name: string): boolean {
    const cur = this.current().children;
    if (!cur || cur[name]) return false;
    cur[name] = { type: 'folder', icon: 'fa-folder', children: {} };
    this.persist();
    return true;
  }

  writeFile(name: string, text: string): boolean {
    const cur = this.current().children;
    if (!cur) return false;
    const kb = Math.max(1, Math.round(text.length / 1024));
    cur[name] = { type: 'file', icon: iconForFile(name), size: `${kb} KB`, text };
    this.persist();
    return true;
  }

  renameItem(name: string, next: string): boolean {
    const cur = this.current().children;
    if (!cur || !cur[name] || cur[next]) return false;
    cur[next] = cur[name];
    delete cur[name];
    this.persist();
    return true;
  }

  deleteItem(name: string): DeletedItem | null {
    const cur = this.current().children;
    const item = cur?.[name];
    if (!item || !cur) return null;
    const rec: DeletedItem = { id: idCounter++, name, ...item, path: this.pathString() };
    this.deleted.unshift(rec);
    delete cur[name];
    this.persist();
    return rec;
  }

  restore(id: number): boolean {
    const idx = this.deleted.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    const item = this.deleted.splice(idx, 1)[0];
    let parts = item.path.split('/').filter(Boolean);
    if (parts[0] === 'Home') parts = parts.slice(1);
    let node: FsNode | null = { type: 'folder', icon: 'fa-folder', children: this.tree };
    for (const p of parts) {
      const next: FsNode | null = node?.children?.[p] ?? null;
      if (next && next.type === 'folder') node = next;
      else {
        node = null;
        break;
      }
    }
    if (node && node.children) {
      node.children[item.name] = { type: item.type, icon: item.icon, size: item.size, text: item.text, children: item.children };
      this.persist();
      return true;
    }
    this.tree[item.name] ??= { type: item.type, icon: item.icon, size: item.size, text: item.text, children: item.children };
    this.persist();
    return true;
  }

  bin(): DeletedItem[] {
    return this.deleted;
  }

  emptyBin(): void {
    this.deleted = [];
    this.persist();
  }

  find(query: string): { name: string; path: string; kind: FsNode['type'] }[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: { name: string; path: string; kind: FsNode['type'] }[] = [];
    const walk = (node: Record<string, FsNode>, prefix: string[]) => {
      for (const [name, child] of Object.entries(node)) {
        const p = [...prefix, name];
        if (name.toLowerCase().includes(q)) out.push({ name, path: '/' + p.join('/'), kind: child.type });
        if (child.type === 'folder' && child.children) walk(child.children, p);
      }
    };
    walk(this.tree, []);
    return out.slice(0, 100);
  }
}

export const FS = new FileSystem();