import { useOs } from '../os/store';
import { Sound } from '../os/sound';
import { confetti } from '../components/fx';
import type { AppProps } from '../os/types';

const FLAVOR = [
  'You broke a dimension. Again.',
  'That\'s a classic Rick-sanchez-level offense, Morty.',
  'The Council noticed. My guy, they noticed.',
  'Could have been handled by just... not doing that.',
];

export default function Wanted({ windowId }: AppProps) {
  const os = useOs();
  const bounty = os.crimes.length * 100;
  const w = os.wantedLevel;

  void windowId;

  return (
    <div className="wanted">
      <div className="wanted-poster">
        <p className="wanted-top">GALACTIC FEDERATION</p>
        <p className="wanted-sub">WANTED: {w > 0 ? 'DEAD OR ALIVE' : 'CLEAN RECORD'}</p>
        <div className="wanted-face"><i className={`fas ${os.user.icon}`} /></div>
        <h2>{os.user.name}</h2>
        <p className="wanted-desc">{os.user.role}</p>
        <div className="wanted-stars">
          {Array.from({ length: 6 }).map((_, i) => (
            <i key={i} className={`fas fa-star ${i < w ? 'lite' : ''}`} />
          ))}
        </div>
        <p className="wanted-bounty">
          {w > 0 ? (
            <>BOUNTY: <b>{bounty.toLocaleString()}</b> FLURBO STASH BOXES</>
          ) : (
            'No bounty currently. Suspiciously quiet out there.'
          )}
        </p>
      </div>

      <div className="wanted-crimes">
        <h3>Known crimes</h3>
        {os.crimes.length === 0 && (
          <p className="wanted-clean">Field report: nothing recorded. This is either a miracle or a cover-up. (It\'s the multiverse; it\'s the cover-up.)</p>
        )}
        {os.crimes.map((c, i) => (
          <div key={c.id} className="wanted-crime">
            <span className="wanted-lv">LV{c.level}</span>
            <div>
              <b>{c.label}</b>
              <small>{new Date(c.time).toLocaleTimeString()}</small>
            </div>
            {i === 0 && <i className="fas fa-exclamation-triangle wrn" title="newest" />}
          </div>
        ))}
      </div>

      <div className="wanted-actions">
        {w > 0 ? (
          <>
            <button onClick={() => os.clearCrimes()}><i className="fas fa-sunglasses" /> Lay low a while</button>
            <button className="wanted-surrender" onClick={() => {
              if (Math.random() < 0.4) {
                confetti();
                os.clearCrimes();
                os.notify('Galactic Federation', 'Surrender accepted. Enjoy your boring clean record, sold out to the man.', '🕊️');
              } else {
                Sound.error();
                os.addCrime('Failed surrender attempt (witnessed by a Jerry)');
                os.notify('Federation Liaison', 'Nice try. Forms rejected. You know what happened last time with surrender.', '🚨');
              }
            }}>
              <i className="fas fa-camera" /> Attempt to surrender
              <small className="wanted-risk">(40% it works, 60% it makes it worse)</small>
            </button>
          </>
        ) : (
          <button onClick={() => { Sound.success(); os.notify('Federation Liaison', 'Keep it that way, rookie. Store that passport somewhere safe.', '🛸'); }}>
            <i className="fas fa-file-signature" /> Confirm clean record
          </button>
        )}
      </div>
      {w > 0 && <p className="wanted-flavor">FedHQ intel: {FLAVOR[Math.min(w - 1, FLAVOR.length - 1)]}</p>}
    </div>
  );
}