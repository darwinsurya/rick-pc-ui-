import { useState } from 'react';
import { Sound } from '../os/sound';
import { rickError } from '../os/quotes';
import { USERS } from '../os/users';
import { useOs } from '../os/store';

const VALID = [
  'wubbalubba',
  'wubba lubba dub dub',
  'get schwifty',
  'getschwifty',
  'mr meeseeks',
  'mrmeeseeks',
  'rick',
  'rick c-137',
];

export default function Login({ onEnter }: { onEnter: () => void }) {
  const os = useOs();
  const [pw, setPw] = useState('wubbalubba');
  const [error, setError] = useState<string | null>(null);
  const user = os.user;

  const submit = () => {
    const v = pw
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
    if (VALID.includes(v)) {
      onEnter();
    } else {
      Sound.error();
      setPw('');
      setError(rickError());
    }
  };

  return (
    <div className="login-screen">
      <div className="portal-bg" />
      <div className="login-container">
        <div className="login-users">
          {USERS.map((u) => (
            <button
              key={u.id}
              className={`login-user ${u.id === user.id ? 'active' : ''}`}
              style={{ ['--uaccent' as string]: u.accent }}
              title={u.name}
              onClick={() => {
                Sound.click();
                os.setUser(u.id);
              }}
            >
              <i className={`fas ${u.icon}`} />
            </button>
          ))}
        </div>
        <div className="login-avatar">
          <i className={`fas ${user.icon}`} />
        </div>
        <h2 className="login-title">{user.name}</h2>
        <p className="login-sub">{user.role}</p>
        <div className="login-input-group">
          <input
            type="password"
            placeholder="Enter Password"
            value={pw}
            autoFocus
            onChange={(e) => {
              setPw(e.target.value);
              if (e.target.value) Sound.typing();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
          <button onClick={submit} tabIndex={-1}>
            <i className="fas fa-arrow-right" />
          </button>
        </div>
        <p className="login-hint">{error ? `Incorrect! ${error}` : `“${user.greeting}” · ${user.subtitle}`}</p>
        <button className="login-skip" onClick={onEnter}>
          Skip login · Enter desktop
        </button>
      </div>
    </div>
  );
}