import { useEffect, useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import { confetti } from '../components/fx';
import type { AppProps } from '../os/types';

interface Q {
  q: string;
  opts: string[];
  ans: number;
  note: string;
}

const QS: Q[] = [
  {
    q: 'What is Rick\'s signature catchphrase?',
    opts: ['Get Schwifty', 'Wubba Lubba Dub Dub', 'Oh jeez', 'I-I-I\'m A-A-Aq'],
    ans: 1,
    note: 'It also means "I am in great pain, please help me." Classic.',
  },
  {
    q: 'What does a Meeseeks do?',
    opts: ['Solves conflicts between a married couple', 'Blocks portals', 'Plays harmonica', 'Times travel'],
    ans: 0,
    note: 'They\'ll do whatever you want, then they — SNAP gone. Cya!',
  },
  {
    q: 'Which school does Morty attend?',
    opts: ['Riverside', 'Blitz and Chitz High', 'Harry Herperson Senior High', 'Gator World Prep'],
    ans: 2,
    note: 'Named after the Warden — who Morty brutally defeated, in a universe. Bleh.',
  },
  {
    q: 'What planet is inside the simulation car battery?',
    opts: ['Heistotron', 'Microverse B', 'Gazorpazorp', 'Concordia'],
    ans: 1,
    note: 'And the Microverse B is powered by a Mini-Verse. It\'s a-lotta lot.',
  },
  {
    q: 'The Szechuan sauce is from which restaurant chain?',
    opts: ['Burger King', 'McDonald\'s', 'Arby\'s', 'Seven Seas'],
    ans: 1,
    note: '1998. Limited Mulan McNugget sauce. Morty, I want that Mulan McNugget sauce.',
  },
  {
    q: 'What color are Jerry\'s underpants?',
    opts: ['White', 'Yellow', 'Blue', 'Matching grey'],
    ans: 1,
    note: 'It was a little yellow — emergency pants during a Jerry tour of the citadel.',
  },
  {
    q: 'Birdperson is also known as...',
    opts: ['Gary', 'Little Bird Bird', 'Snuffles', 'Lantern'],
    ans: 1,
    note: 'He\'s half bird-person. He\'s the only Birdperson you\'ll ever meet.',
  },
  {
    q: 'The Galactic Federation\'s response to Rick is...',
    opts: ['Wanted: DEAD OR ALIVE', 'A free trade agreement', 'Nothing. They respect him', 'Stan Lee cameo'],
    ans: 0,
    note: 'And sometimes: dead-ish. The Federation is not subtle.',
  },
];

const PRAISE = [
  'Boom! There\'s a smart Morty!',
  'C’mooon! You did homework. And you didn\'t even cry.',
  'Now THAT is a study session. Your teacher would be proud. If he were real.',
  'Aah, see? This is why you\'re the BEST Morty.',
];

const ROAST = [
  'Oooh, that\'s not right, Morty.',
  'I thought you were a college-supporting student, Morty.',
  'Even a Jerry overlord knows that one, Morty.',
  'Read a book, Morty! Or a holo-book. Any book!',
];

export default function MortyHomework({ windowId }: AppProps) {
  const os = useOs();
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QS[idx];

  const pick = (i: number) => {
    if (answer !== null) return;
    setAnswer(i);
    if (i === q.ans) {
      Sound.success();
      setScore((s) => s + 1);
      os.notify('Goldenfold\'s approval', PRAISE[Math.floor(Math.random() * PRAISE.length)], '📚');
    } else {
      Sound.error();
      os.notify('Rick intervention', ROAST[Math.floor(Math.random() * ROAST.length)], '🤦');
    }
  };

  const next = () => {
    setAnswer(null);
    if (idx + 1 >= QS.length) {
      setDone(true);
      if (score >= 6) confetti();
    } else {
      setIdx((i) => i + 1);
    }
  };

  useEffect(() => {
    if (done && score >= 6) confetti();
  }, [done, score]);

  void windowId;

  return (
    <div className="hw">
      <div className="hw-head">
        <div className="hw-chalk">
          <span>MR. GOLDENFOLD'S</span>
          <h3>MULTIVERSAL TRIVIA</h3>
          <p>Homework help, Morty. Real homework help. C’mon.</p>
        </div>
      </div>

      {!done ? (
        <div className="hw-body">
          <div className="hw-progress">
            <span>Q {idx + 1} / {QS.length}</span>
            <span>score: {score}</span>
          </div>
          <h2 className="hw-q">{q.q}</h2>
          <div className="hw-opts">
            {q.opts.map((o, i) => {
              let cls = '';
              if (answer !== null) {
                if (i === q.ans) cls = 'correct';
                else if (i === answer) cls = 'wrong';
                else cls = 'dim';
              }
              return (
                <button key={i} className={cls} disabled={answer !== null} onClick={() => pick(i)}>
                  <span className="hw-key">{String.fromCharCode(65 + i)}</span>
                  {o}
                </button>
              );
            })}
          </div>
          {answer !== null && (
            <div className={`hw-feedback ${answer === q.ans ? 'win' : 'lose'}`}>
              <p>{q.note}</p>
              <button onClick={next}>{idx + 1 >= QS.length ? 'See grade' : 'Next question'}</button>
            </div>
          )}
        </div>
      ) : (
        <div className={`hw-grade ${score >= 6 ? 'pass' : 'fail'}`}>
          {score >= 6 ? <i className="fas fa-trophy" /> : <i className="fas fa-poop" />}
<h2>{score >= 6 ? 'A+ — Mr. Goldenfold approves!' : `A ${score}/8... We'll fix your grade with a portal, Morty.`}</h2>
          <p>
            {score >= 6
              ? "You studied for a real test! Kind of. This is the most homework you've done all season."
              : "Aah, jeez — schedule a summer adventure to a universe where you're smarter. It's cheaper than tutoring."}
          </p>
          <button onClick={() => { setIdx(0); setScore(0); setAnswer(null); setDone(false); }}>Retake the test</button>
        </div>
      )}
    </div>
  );
}