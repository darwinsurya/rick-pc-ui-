import { useEffect, useRef, useState } from 'react';
import { FS } from '../os/files';
import { Sound } from '../os/sound';
import { rickError, rickQuote } from '../os/quotes';
import type { AppProps } from '../os/types';
import { useOs } from '../os/store';

interface Line {
  text?: string;
  lines?: string[];
  kind?: 'out' | 'err' | 'dim' | 'ok';
}

const HELP: string[] = [
  'Available commands:',
  '  help             this list',
  '  ls               list this directory',
  '  cd <path>        change directory (.., /, ~/home, relative paths)',
  '  cat <file>       read a file',
  '  mkdir <name>     create a directory',
  '  rm <name>        delete a file/folder',
  '  echo <text>      print a message',
  "  open <app>       open an app: terminal, files, browser, editor, notes,",
  '                   paint, music, calc, photos, settings...',
  '  whereami         show current directory',
  '  clear            clear the screen',
  '  reset            reset the filesystem',
];

export default function Terminal({ windowId }: AppProps) {
  const os = useOs();
  const [out, setOut] = useState<Line[]>(() => [
    { lines: ['WUBBA LUBBA DUB DUB!', 'Citadel OS Terminal v9.0.1 — "Now that\'s a multiverse with some flavor."', 'Type help for a list of commands.'], kind: 'dim' },
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [out]);

  const prompt = () => `rick@c-137:~${FS.pathString()}$`;

  const run = (raw: string) => {
    const cmd = raw.trim();
    setOut((o) => [...o, { text: `${prompt()} ${cmd}`, kind: 'ok' }]);
    if (!cmd) return;
    const [c, ...args] = cmd.toLowerCase().replace(/\s+/g, ' ').split(' ');

    const result: string[] = [];
    let kind: Line['kind'] = 'out';

    switch (c) {
      case 'help':
        result.push(...HELP);
        kind = 'dim';
        break;
      case 'ls': {
        const cur = FS.current();
        const kids = Object.entries(cur.children || {}).sort(([a], [b]) => a.localeCompare(b));
        if (!kids.length) result.push('(empty galactic wilderness)');
        kids.forEach(([name, node]) =>
          result.push(node.type === 'folder' ? `${name}/` : `${name}  (${node.size || '?'})`),
        );
        break;
      }
      case 'cd': {
        const a = args.join(' ');
        if (!a || a === '~' || a === '/' || a === 'home' || a === 'root') FS.upToRoot();
        else if (FS.cd(args)) result.push(`Moved to ${FS.pathString()}`);
        else {
          result.push(`cd: no such directory in this dimension`);
          kind = 'err';
        }
        break;
      }
      case 'cat': {
        const name = args.join(' ');
        const node = FS.current()?.children?.[name];
        if (!node) result.push(`cat: ${name}: no such file`);
        else if (node.type === 'file') result.push(node.text ?? '(empty)');
        else result.push(`cat: ${name}: is a directory`);
        break;
      }
      case 'mkdir': {
        const name = args.join(' ');
        if (!name) result.push('mkdir: missing operand');
        else if (FS.current().children?.[name]) result.push(`mkdir: ${name}: already exists`);
        else if (FS.mkdir(name)) result.push(`Created ${name}/`);
        else result.push('mkdir: could not create here');
        break;
      }
      case 'rm': {
        const name = args.join(' ');
        const cur = FS.current();
        if (!cur.children?.[name]) result.push(`rm: ${name}: no such file`);
        else if (FS.deleteItem(name)) result.push(`Sent ${name} to the garbage dimension.`);
        break;
      }
      case 'echo':
        result.push(args.join(' '));
        break;
      case 'open': {
        const a = args.join(' ');
        if (a && os.appList[a]) {
          os.openApp(a);
          result.push(`Opening ${a}...`);
        } else {
          result.push(`open: unknown app "${a}"`);
          kind = 'err';
        }
        break;
      }
      case 'whereami':
        result.push(FS.pathString());
        break;
      case 'clear':
        setOut([]);
        return;
      case 'reset': {
        FS.reset();
        result.push('Filesystem reborn. The old one is probably in a dumpster in Dimension 35-C.');
        break;
      }
      case 'rick':
        result.push('I\'m Rick. Is that all you needed?');
        result.push(rickQuote());
        break;
      default:
        result.push(`bash-like: command not found: ${c}`);
        result.push('Type help for a list of commands.');
        kind = 'err';
    }

    setOut((o) => [...o, { lines: result, kind }]);
    Sound.typing();
    void windowId;
  };

  return (
    <div className="term">
      <div className="term-bar">
        <span>🔷</span> Citadel OS terminal — {FS.pathString()}
      </div>
      <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
        {out.map((l, i) =>
          l.text ? (
            <div key={i} className="term-row ok">{l.text}</div>
          ) : (
            l.lines?.map((ln, j) => (
              <div key={`${i}-${j}`} className={`term-row ${l.kind || 'out'}`}>{ln}</div>
            ))
          ),
        )}
        <div className="term-prompt">
          <span className="term-ps">{prompt()}</span>
          <input
            ref={inputRef}
            value={input}
            autoFocus
            placeholder={rickError()}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                run(input);
                setInput('');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}