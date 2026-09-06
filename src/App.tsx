import { useEffect, useState } from 'react';
import { OsProvider, useOs, welcomeMessage } from './os/store';
import { Sound } from './os/sound';
import Boot from './components/Boot';
import Login from './components/Login';
import Desktop from './components/Desktop';

function Shell() {
  const [phase, setPhase] = useState<'boot' | 'login' | 'desktop'>('boot');
  const os = useOs();

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPhase('login');
      Sound.powerOn();
    }, 3800);
    return () => window.clearTimeout(t);
  }, []);

  const finishLogin = () => {
    Sound.login();
    os.setBootTime(Date.now());
    setPhase('desktop');
    window.setTimeout(() => {
      os.notify('Welcome to C-137!', welcomeMessage(), '🧠');
    }, 1200);
  };

  return (
    <>
      {phase === 'boot' && <Boot />}
      {phase === 'login' && <Login onEnter={finishLogin} />}
      {phase === 'desktop' && <Desktop />}
    </>
  );
}

export default function App() {
  return (
    <OsProvider>
      <Shell />
    </OsProvider>
  );
}