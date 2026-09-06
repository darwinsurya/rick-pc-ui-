import { useEffect, useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import type { AppProps } from '../os/types';

const KEY = 'rm-notes';

const DEFAULT = `Morty's notes — probably about relaxing, if aliens didn't keep kidnapping us.

experiment ABQ-9001:
- do NOT feed the talking rat
- juicing has escalating returns
- traveling to any dimension with a moon is a scouting error

...but seriously, Morty, take some notes about how SICK this invention is.`;

const LOAD_LINES = {
  saved: 'Note saved. The note exists. Somewhere.',
  persists: 'Wubba lubba dub dub — your note is stored on this dimension\'s disk.',
};

export default function Notes({ windowId }: AppProps) {
  const os = useOs();
  const [text, setText] = useState<string>(() => {
    try {
      return localStorage.getItem(KEY) ?? DEFAULT;
    } catch {
      return DEFAULT;
    }
  });
  void windowId;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const save = () => {
    try {
      localStorage.setItem(KEY, text);
      Sound.success();
      os.notify('Notepad', LOAD_LINES.saved, '📝');
    } catch {
      Sound.error();
      os.notify('Notepad', 'This dimension refuses to store anything.', '⚠️');
    }
  };

  return (
    <div className="notes">
      <div className="notes-infobar">
        <i className="fas fa-note-sticky" />
        <b>Notepad · Notes.txt</b>
        <span className="notes-keystatus">{text.trim() ? LOAD_LINES.persists : '(empty)'}</span>
        <button className="notes-save" onClick={save} title="Save note">
          <i className="fas fa-save" />
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          Sound.typing();
        }}
      />
    </div>
  );
}