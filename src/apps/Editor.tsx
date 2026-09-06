import { useEffect, useRef, useState } from 'react';
import { Sound } from '../os/sound';
import { takeLatest } from '../os/channel';
import { FS } from '../os/files';
import { useOs } from '../os/store';
import type { AppProps } from '../os/types';

const DEFAULT = `// Citadel OS Code Editor
// Welcome, scientist. Type some code, or open a file from the Finder.
// Hit Run to execute it — console.log output lands in the panel below.

function schwang() {
  return 'Wubba lubba dub dub';
}

console.log(schwang());
`;

const fmt = (a: unknown): string => {
  if (typeof a === 'string') return a;
  try {
    return JSON.stringify(a);
  } catch {
    return String(a);
  }
};

export default function Editor({ windowId }: AppProps) {
  const os = useOs();
  const [code, setCode] = useState(DEFAULT);
  const [file, setFile] = useState('untitled.js');
  const [output, setOutput] = useState<string[]>([]);
  const ivRef = useRef<number | null>(null);

  useEffect(() => {
    const consume = () => {
      const ev = takeLatest('editor');
      if (ev && typeof ev === 'object') {
        const { name, text } = ev as { name?: string; text?: string };
        if (name) setFile(name);
        if (text !== undefined) setCode(text);
      }
    };
    consume();
    ivRef.current = window.setInterval(consume, 450);
    return () => {
      if (ivRef.current) window.clearInterval(ivRef.current);
      ivRef.current = null;
    };
  }, [windowId]);

  const run = () => {
    const out: string[] = [];
    const fakeConsole = {
      log: (...a: unknown[]) => out.push(a.map(fmt).join(' ')),
      info: (...a: unknown[]) => out.push(a.map(fmt).join(' ')),
      warn: (...a: unknown[]) => out.push('⚠ ' + a.map(fmt).join(' ')),
      error: (...a: unknown[]) => out.push('✗ ' + a.map(fmt).join(' ')),
    };
    try {
      new Function('console', code)(fakeConsole);
      if (!out.length) out.push('(program finished, no output)');
    } catch (err) {
      out.push('✗ ' + (err instanceof Error ? err.message : String(err)));
    }
    Sound.success();
    setOutput(out);
  };

  const save = () => {
    if (FS.writeFile(file, code)) {
      Sound.success();
      os.notify('Code saved', `Saved to ${FS.pathString()}/${file} — persisted across dimensions.`, '💾');
    } else {
      Sound.error();
      os.notify('Code editor', 'Could not write file here.', '⚠️');
    }
  };

  return (
    <div className="editor">
      <div className="ed-bar">
        <span className="ed-file">{file}</span>
        <div className="ed-controls">
          <button onClick={save} title="Save to the filesystem">
            <i className="fas fa-save" /> Save
          </button>
          <button onClick={run}><i className="fas fa-play" /> Run</button>
        </div>
      </div>
      <textarea
        spellCheck={false}
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          Sound.typing();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const t = e.currentTarget;
            const s = t.selectionStart ?? 0;
            setCode((c) => c.slice(0, s) + '  ' + c.slice(t.selectionEnd ?? s));
          }
        }}
      />
      <div className="ed-out">
        <div className="ed-out-head"><i className="fas fa-terminal" /> Output</div>
        {output.length === 0 ? (
          <span className="ed-out-empty">Press Run to execute the code.</span>
        ) : (
          output.map((l, i) => (
            <span key={i} className={l.startsWith('✗') ? 'err' : l.startsWith('⚠') ? 'warn' : ''}>{l}</span>
          ))
        )}
      </div>
    </div>
  );
}