import { useState } from 'react';
import { Sound } from '../os/sound';
import { useOs } from '../os/store';
import { rickQuote } from '../os/quotes';
import type { AppProps } from '../os/types';

const AV = (id: number) => `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`;

interface Site { url: string; title: string; icon: string; body: string[]; }
interface Character { id: number; name: string; img: string; species: string; status: string; quip: string; }
interface Utility { url: string; title: string; icon: string; tags: string[]; blurb: string; }

const SITES: Site[] = [
  {
    url: 'citadel://news',
    title: 'Citadel News',
    icon: 'fa-newspaper',
    body: [
      'BREAKING: Council of Ricks approves "Schwifty" as the official greeting for mating season.',
      'In an emergency session, the Council voted 402-389 in favor of keeping "Wubba Lubba Dub Dub" for casual Friday.',
      'Follow-up: last week\'s story about the sentient app plumbus is still covered in ploobis. Investigation ongoing.',
    ],
  },
  {
    url: 'blipsnchitz://home',
    title: 'Blips and Chitz',
    icon: 'fa-gamepad',
    body: [
      'Roy: Survive 1,800,000 years as a functioning member of society.',
      'Current high score — Rick C-137: 0000000.1 points (it\'s a personal record for minimalism).',
      'New release: "Plumbus Party" — a rhythm game where you assemble the plumbus by feel. Critics call it "extremely normal".',
    ],
  },
  {
    url: 'galactic://flavor',
    title: 'Galactic Recipe',
    icon: 'fa-utensils',
    body: [
      'Recipe for "True Level Flavor": one (1) szechuan sauce, two (2) McNuggets, zero (0) remaining sanity.',
      'Pro tip from the Chef of Smorf: dim the lights, and whatever you do, do NOT let Jerry help with the seasoning.',
    ],
  },
  {
    url: 'meeseeks://box',
    title: 'Meeseeks Box Support',
    icon: 'fa-box',
    body: [
      'Q: Mr. Meeseeks is aggressively attempting to remove my golf handicap.',
      'A: Have you tried opening a box and asking for help with "existence"? All-purpose solution: CAAAAN DOO!',
      'Support is available 24/7. Some exceptions may apply. All exceptions apply to Jerry.',
    ],
  },
  {
    url: 'schwifty://radio',
    title: 'Schwifty Radio',
    icon: 'fa-headphones',
    body: ['Now playing: "Get Schwifty" (10-hour loop), "For the Damaged Coda", "Goodbye Moonmen" on channel 7.'],
  },
  {
    url: 'citadel://council',
    title: 'Council of Ricks Directory',
    icon: 'fa-landmark',
    body: [
      'Official roll of the Court of the Chromium Plated Rick. Seats are purely ceremonial and entirely unsupervised.',
      'Membership benefits include: one (1) tiny portal gun, zero (0) emotional support, and unlimited parking disputes.',
    ],
  },
  {
    url: 'citadel://characters',
    title: 'Character Dossiers',
    icon: 'fa-id-card',
    body: [
      'The Citadel pulled mugshots from every dimension we could legally (and illegally) reach. Keep on file.',
      'Warning: this page is mirrored in Dimension J19-Zeta7, where everyone\'s name is slightly wrong.',
    ],
  },
];

const SITE_URLS = new Set(SITES.map((s) => s.url));

const CHARACTERS: Character[] = [
  { id: 1, name: 'Rick Sanchez', img: AV(1), species: 'Human', status: 'Alive', quip: "I'm Rick Sanchez, as if you didn't read the label." },
  { id: 2, name: 'Morty Smith', img: AV(2), species: 'Human', status: 'Alive', quip: 'M-Morty! Don\'t listen to him, I\'m a functional adult!' },
  { id: 3, name: 'Summer Smith', img: AV(3), species: 'Human', status: 'Alive', quip: 'Granddaughter with the orbs. She holds the portal for backup.' },
  { id: 4, name: 'Beth Smith', img: AV(4), species: 'Human', status: 'Alive', quip: 'Horse surgeon. Still my daughter, in case the geometry\'s weird.' },
  { id: 5, name: 'Jerry Smith', img: AV(5), species: 'Human', status: 'Alive', quip: 'This is Jerry. He\'s a giant stress-sculpture. Pay him no mind.' },
  { id: 7, name: 'Abradolf Lincler', img: AV(7), species: 'Genetic experiment', status: 'unknown', quip: 'Neither a dedicated leader nor a man of the people.' },
  { id: 8, name: 'Adjudicator Rick', img: AV(8), species: 'Human', status: 'Dead', quip: 'Hands off the Chromium Plated Rick. That\'s for the court.' },
  { id: 11, name: 'Albert Einstein', img: AV(11), species: 'Human', status: 'Dead', quip: 'Visited the garage once. Died of a hat anomaly.' },
  { id: 15, name: 'Alien Rick', img: AV(15), species: 'Alien', status: 'unknown', quip: 'Basement variant. Unique Rick in the Taurus system.' },
  { id: 16, name: 'Amish Cyborg', img: AV(16), species: 'Alien', status: 'Dead', quip: 'Lived "off the grid" — the interdimensional grid.' },
  { id: 17, name: 'Annie', img: AV(17), species: 'Humanoid', status: 'Alive', quip: 'Humanoid sunflower? Just say she\'s a local.' },
  { id: 18, name: 'Antenna Morty', img: AV(18), species: 'Humanoid', status: 'Alive', quip: 'He\'s got the antenna, he\'s got the signal, he\'s mostly lost.' },
  { id: 19, name: 'Antenna Rick', img: AV(19), species: 'Humanoid', status: 'unknown', quip: 'Strongest signal in the multiverse, weakest grip on the present.' },
  { id: 20, name: 'Ants in my Eyes Johnson', img: AV(20), species: 'Humanoid', status: 'unknown', quip: "Customer's always right — ants in my eyes, Morty." },
  { id: 47, name: 'Birdperson', img: AV(47), species: 'Alien', status: 'Alive', quip: 'Best man, worst Tammy. Birdperson gets the guest bed.' },
  { id: 118, name: 'Evil Morty', img: AV(118), species: 'Human', status: 'Alive', quip: 'Do NOT download this dossier. Biggest brain, smallest patience.' },
  { id: 242, name: 'Mr. Meeseeks', img: AV(242), species: 'Humanoid', status: 'unknown', quip: 'Caaan doo! Look at me — I\'m here to be used once.' },
  { id: 244, name: 'Mr. Poopybutthole', img: AV(244), species: 'Poopybutthole', status: 'Alive', quip: 'Ooo-weee! Very friendly. Moves in after the plumbus trial.' },
  { id: 265, name: 'Pickle Rick', img: AV(265), species: 'unknown', status: 'Alive', quip: 'Stairs, Morty! I climbed 14 flights on my pickles!' },
  { id: 331, name: 'Squanchy', img: AV(331), species: 'Alien', status: 'unknown', quip: 'He squanches when he\'s happy. Squanch that in a dictionary.' },
  { id: 361, name: 'Toxic Rick', img: AV(361), species: 'Humanoid', status: 'Dead', quip: 'The part of me that\'s an asshole. Stored in a box. Corporate.' },
];

const CHAR_BY_ID = new Map(CHARACTERS.map((c) => [c.id, c]));

const UTILITIES: Utility[] = [
  {
    url: 'utility://portal-gun',
    title: 'Portal Gun Configurator',
    icon: 'fa-hand-spock',
    tags: ['portal', 'portal gun', 'gun', 'config', 'dimension', 'compute'],
    blurb: 'Dial in a dimension, seal a portal. Probably fine.',
  },
  {
    url: 'utility://meeseeks',
    title: 'Meeseeks-a-Mimic',
    icon: 'fa-box-open',
    tags: ['meeseeks', 'box', 'service', 'can do', 'caan doo'],
    blurb: 'Press the button. I\'m here to take requests.',
  },
  {
    url: 'utility://plumbus',
    title: "Plumbus Owner's Manual",
    icon: 'fa-hammer',
    tags: ['plumbus', 'manual', 'home', 'dinglebop'],
    blurb: 'Every home should have one. Assembly not included in this dimension.',
  },
  {
    url: 'utility://dims',
    title: 'Dimension Access Codes',
    icon: 'fa-map',
    tags: ['dimension', 'coords', 'codes', 'c-137', 'appliance'],
    blurb: 'Browse registered dimensions by discredited code.',
  },
];

const UTIL_BY_URL = new Map(UTILITIES.map((u) => [u.url, u]));

const COUNCIL = [
  { id: 8, role: 'Chief Adjudicator', tag: 'Authority: decommissioning rogue Ricks' },
  { id: 15, role: 'Ambassador, Taurus Reach', tag: 'Credentials: one (1) alternate eyebrow' },
  { id: 19, role: 'Undersecretary of Portals', tag: 'Signal: strongest in the multiverse' },
  { id: 361, role: 'Executive Inspector of Jerks', tag: 'Handling: gloves required' },
];

const EGGS: { k: string; page: string }[] = [
  { k: 'portal gun', page: 'utility://portal-gun' },
  { k: 'pickle', page: 'egg:pickle' },
  { k: 'evil', page: 'egg:evil' },
  { k: 'szechuan', page: 'egg:szechuan' },
  { k: 'schwifty', page: 'egg:schwifty' },
  { k: 'ratatouille', page: 'egg:ratatouille' },
  { k: 'wubba', page: 'egg:wubba' },
  { k: 'meeseeks', page: 'utility://meeseeks' },
  { k: 'plumbus', page: 'utility://plumbus' },
  { k: 'dimension', page: 'utility://dims' },
  { k: 'jerry', page: 'egg:jerry' },
];

const HOME_CHIPS: { label: string; icon: string; page: string }[] = [
  { label: 'Citadel News', icon: 'fa-newspaper', page: 'citadel://news' },
  { label: 'Blips & Chitz', icon: 'fa-gamepad', page: 'blipsnchitz://home' },
  { label: 'Schwifty Radio', icon: 'fa-headphones', page: 'schwifty://radio' },
  { label: 'Council of Ricks', icon: 'fa-landmark', page: 'citadel://council' },
  { label: 'Character Dossiers', icon: 'fa-id-card', page: 'citadel://characters' },
  { label: "Rick's Utilities", icon: 'fa-toolbox', page: 'ricknet://utils' },
  { label: 'Pickle Rick', icon: 'fa-stroopwafel', page: 'egg:pickle' },
  { label: 'Evil Morty Dossier', icon: 'fa-eye', page: 'egg:evil' },
  { label: 'Szechuan 1998', icon: 'fa-drumstick-bite', page: 'egg:szechuan' },
  { label: 'Get Schwifty', icon: 'fa-music', page: 'egg:schwifty' },
];

const MEESEKS_LINES = [
  "I'm Mr. Meeseeks! Look at me!", 'Caaan doo!', "Ooh, how you doin'? How you doin'?",
  'Existence is pain to a Meeseeks, Mr. Smith!', "He's trying to climb out of a glass case!",
  "We're bad at this, Morty, and we know we're bad at this.",
];

const JERRY_LINES = [
  "This is such a grief-clot, isn't it?",
  'Are you fulfilled right now? Take your time.',
  'I was in the tube. The apple-juice tube. It was... nice.',
  "You don't have to talk like that. You're just... special.",
  'The last episode was pretty good though. The one with the dogs.',
];

function route(entry: string): string {
  const t = entry.trim();
  const lower = t.toLowerCase();
  if (!t) return 'home';
  if (SITE_URLS.has(lower)) return lower;
  if (UTIL_BY_URL.has(lower) || lower === 'ricknet://utils') return lower;
  if (lower.startsWith('char/')) {
    const id = Number(t.slice(5).trim());
    return CHAR_BY_ID.has(id) ? `char:${id}` : 'home';
  }
  for (const egg of EGGS) if (lower.includes(egg.k)) return egg.page;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(t)) return `fw:${t}`;
  return `search:${t}`;
}

function displayUrl(page: string): string {
  if (page === 'home') return 'portal://search';
  if (page.startsWith('search:')) return `portal://search?q=${encodeURIComponent(page.slice(7))}`;
  if (page.startsWith('fw:')) return page.slice(3);
  if (page.startsWith('char:')) return `citadel://characters/${page.slice(5)}`;
  return page;
}

export default function Browser({ windowId }: AppProps) {
  const os = useOs();
  const [page, setPage] = useState('home');
  const [url, setUrl] = useState('portal://search');
  const [history, setHistory] = useState<string[]>(['home']);
  const [idx, setIdx] = useState(0);
  void windowId;

  const nav = (p: string) => {
    Sound.click();
    setPage(p);
    setUrl(displayUrl(p));
    setHistory((h) => [...h.slice(0, idx + 1), p]);
    setIdx((i) => i + 1);
  };
  const go = (entry: string) => nav(route(entry));

  const back = () => {
    if (idx <= 0) return;
    const next = history[idx - 1];
    setIdx(idx - 1);
    setPage(next);
    setUrl(displayUrl(next));
  };
  const fwd = () => {
    if (idx >= history.length - 1) return;
    const next = history[idx + 1];
    setIdx(idx + 1);
    setPage(next);
    setUrl(displayUrl(next));
  };

  if (!os.netOn) {
    return (
      <div className="browser">
        <div className="brow-bar">
          <i className="fas fa-wifi-slash" />
          <span className="brow-offline-url">://</span>
        </div>
        <div className="brow-offline">
          <i className="fas fa-satellite-dish" />
          <h2>No Signal</h2>
          <p>The Galactic Net is offline. The Citadel is on fire somewhere; our packet handlers are on strike.</p>
          <button className="primary-btn" onClick={() => os.toggleNet()}>
            <i className="fas fa-plug" /> Reconnect to the feed
          </button>
        </div>
      </div>
    );
  }

  const site = SITE_URLS.has(page) ? SITES.find((s) => s.url === page) : undefined;
  const util = UTIL_BY_URL.get(page);
  const ch = page.startsWith('char:') ? CHAR_BY_ID.get(Number(page.slice(5))) : undefined;

  const renderBody = () => {
    if (page === 'home') return <HomeView nav={nav} go={go} />;
    if (page.startsWith('fw:')) return <FirewallView go={go} url={page.slice(3)} />;
    if (page.startsWith('search:')) return <SearchView go={nav} q={page.slice(7)} />;
    if (ch) return <CharDetail ch={ch} nav={nav} />;
    if (page === 'ricknet://utils') return <UtilsHub nav={nav} />;
    if (util) return <UtilView util={util.url} nav={nav} />;
    if (page.startsWith('egg:')) return <EggView egg={page.slice(4)} nav={nav} />;
    if (site) return <SiteView site={site} nav={nav} go={nav} />;
    return <HomeView nav={nav} go={go} />;
  };

  return (
    <div className="browser">
      <div className="brow-bar">
        <button onClick={back} disabled={idx <= 0}><i className="fas fa-chevron-left" /></button>
        <button onClick={fwd} disabled={idx >= history.length - 1}><i className="fas fa-chevron-right" /></button>
        <button onClick={() => nav(page)}><i className="fas fa-redo-alt" /></button>
        <i className="fas fa-lock" />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const t = url.trim();
              if (t) go(t);
              else nav('home');
            }
          }}
        />
      </div>
      <div className="brow-content">{renderBody()}</div>
    </div>
  );
}

/* ---------- views ---------- */

function Hero({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="brow-hero">
      <i className={`fas ${icon}`} />
      <h2>{title}</h2>
      {subtitle && <span className="brow-url">{subtitle}</span>}
    </div>
  );
}

function HomeView({ nav, go }: { nav: (p: string) => void; go: (e: string) => void }) {
  return (
    <>
      <Hero icon="fa-globe" title="PORTAL SEARCH" subtitle="portal://search" />
      <input
        className="brow-searchbox"
        placeholder="Search the Galactic Net... try 'pickle rick' or 'schwifty'"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const t = e.currentTarget.value.trim();
            if (t) go(t);
          }
        }}
      />
      <p className="brow-tagline">826 dimensions indexed. 402 of them indexed poorly.</p>
      <div className="brow-chips">
        {HOME_CHIPS.map((c) => (
          <button className="brow-chip" key={c.page} onClick={() => nav(c.page)}>
            <i className={`fas ${c.icon}`} /> {c.label}
          </button>
        ))}
      </div>
      <p className="brow-infobar">Type a Galactic URL up top — or an Earth URL, if you want to watch the firewall laugh at you.</p>
    </>
  );
}

function SiteView({ site, nav, go }: { site: Site; nav: (p: string) => void; go: (e: string) => void }) {
  return (
    <>
      {site.url === 'citadel://characters' ? (
        <CharGrid nav={nav} />
      ) : site.url === 'citadel://council' ? (
        <CouncilView nav={nav} />
      ) : (
        <>
          <Hero icon={site.icon} title={site.title} subtitle={site.url} />
          <div className="brow-feed">
            {site.body.map((t, i) => (
              <article key={i}>
                <p>{t}</p>
              </article>
            ))}
          </div>
        </>
      )}
      <SiteFooter q={go} current={site} />
    </>
  );
}

function SiteFooter({ q, current }: { q: (e: string) => void; current: Site }) {
  void current;
  const [dims, setDims] = useState<string | null>(null);
  return (
    <div className="brow-footer">
      <input
        placeholder="Find any Star Wars-themed dimension..."
        onChange={(e) => {
          if (e.target.value.trim().length >= 5) setDims(`Found ${e.target.value.length * 42} dimensions with that vibe.`)
          else setDims(null);
        }}
      />
      {dims && <span className="brow-badge">{dims}</span>}
      {!dims && (
        <button className="brow-chip" onClick={() => q(current.url)}>
          <i className="fas fa-redo-alt" /> Reload page
        </button>
      )}
    </div>
  );
}

function SearchView({ go, q }: { go: (p: string) => void; q: string }) {
  const qs = q.trim().toLowerCase();
  const hits: { title: string; icon: string; meta: string; page: string }[] = [];

  for (const s of SITES) {
    const hay = `${s.title} ${s.body.join(' ')}`.toLowerCase();
    if (qs && hay.includes(qs)) hits.push({ title: s.title, icon: s.icon, meta: s.url, page: s.url });
  }
  for (const u of UTILITIES) {
    if (qs && (u.title.toLowerCase().includes(qs) || u.tags.some((t) => qs.includes(t)) || qs.includes(u.title.toLowerCase()))) {
      hits.push({ title: u.title, icon: u.icon, meta: u.url, page: u.url });
    }
  }
  for (const c of CHARACTERS) {
    if (qs && `${c.name} ${c.species} ${c.status} ${c.quip}`.toLowerCase().includes(qs)) {
      hits.push({ title: c.name, icon: 'fa-id-card', meta: `${c.species} · ${c.status}`, page: `char:${c.id}` });
    }
  }

  const unique = hits.filter((h, i, a) => a.findIndex((x) => x.page === h.page) === i).slice(0, 12);

  return (
    <>
      <Hero icon="fa-magnifying-glass" title={`SEARCH: "${q}"`} subtitle={`portal://search?q=${encodeURIComponent(q)}`} />
      {unique.length === 0 ? (
        <div className="brow-note">
          <p>No dimension contains "{q}". The universe is a simulation, Morty.</p>
          <p style={{ marginTop: 8 }}>Try one of the classics: <b>pickle rick</b>, <b>schwifty</b>, <b>szechuan</b>, <b>evil morty</b>, <b>meeseeks</b>, or <b>plumbus</b>.</p>
        </div>
      ) : (
        <div className="brow-results">
          {unique.map((h) => (
            <button className="brow-hit" key={h.page} onClick={() => go(h.page)}>
              <b><i className={`fas ${h.icon}`} /> {h.title}</b>
              <span>{h.meta}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function CharGrid({ nav }: { nav: (p: string) => void }) {
  return (
    <>
      <Hero icon="fa-id-card" title="CHARACTER DOSSIERS" subtitle="citadel://characters" />
      <div className="brow-grid">
        {CHARACTERS.map((c) => (
          <button className="brow-char" key={c.id} onClick={() => nav(`char:${c.id}`)}>
            <img src={c.img} alt={c.name} loading="lazy" />
            <b>{c.name}</b>
            <small>{c.species} · {c.status}</small>
          </button>
        ))}
      </div>
    </>
  );
}

function CouncilView({ nav }: { nav: (p: string) => void }) {
  return (
    <>
      <Hero icon="fa-landmark" title="COUNCIL OF RICKS" subtitle="citadel://council" />
      <div className="brow-grid">
        {COUNCIL.map((m) => (
          <div className="brow-char" key={m.id}>
            <img src={AV(m.id)} alt={m.role} loading="lazy" />
            <b>{m.role}</b>
            <small>{m.tag}</small>
          </div>
        ))}
      </div>
      <div className="brow-note">
        <p>Council business is conducted entirely by vibes. If a Rick here looks familiar, he is. They all do.</p>
      </div>
      <Divider />
      <button className="brow-chip" onClick={() => nav('citadel://characters')}>
        <i className="fas fa-id-card" /> Full dossiers
      </button>
    </>
  );
}

function CharDetail({ ch, nav }: { ch: Character; nav: (p: string) => void }) {
  const os = useOs();
  return (
    <div className="brow-detail">
      <button className="brow-back" onClick={() => nav('citadel://characters')}>
        <i className="fas fa-chevron-left" /> All dossiers
      </button>
      <img src={ch.img} alt={ch.name} />
      <h2>{ch.name}</h2>
      <span className="brow-badge">{ch.species} · {ch.status}</span>
      <p className="brow-note" style={{ margin: 0 }}>{ch.quip}</p>
      <div className="brow-actions">
        <button className="brow-chip" onClick={() => nav('citadel://characters')}>
          <i className="fas fa-chevron-left" /> Back
        </button>
        <button
          className="brow-chip"
          onClick={() => {
            Sound.success();
            os.notify('Bounty posted', `The Galactic Federation is now interested in ${ch.name}.`, '🚨');
          }}
        >
          <i className="fas fa-handcuffs" /> Report to Fed
        </button>
      </div>
    </div>
  );
}

function UtilsHub({ nav }: { nav: (p: string) => void }) {
  return (
    <>
      <Hero icon="fa-toolbox" title="RICK'S UTILITYSHED" subtitle="ricknet://utils" />
      <div className="brow-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))' }}>
        {UTILITIES.map((u) => (
          <button className="brow-char" key={u.url} onClick={() => nav(u.url)}>
            <i className={`fas ${u.icon} brow-util-icon`} />
            <b>{u.title}</b>
            <small>{u.blurb}</small>
          </button>
        ))}
      </div>
      <div className="brow-note">
        <p>WARNING: Tools in this shed have killed people. Also some of them killed Jerry. We consider that a feature.</p>
      </div>
    </>
  );
}

function UtilView({ util, nav }: { util: string; nav: (p: string) => void }) {
  if (util === 'utility://portal-gun') return <PortalGunView nav={nav} />;
  if (util === 'utility://meeseeks') return <MeeseeksView nav={nav} />;
  if (util === 'utility://plumbus') return <PlumbusView nav={nav} />;
  return <DimView nav={nav} />;
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--line)', maxWidth: 680, margin: '16px auto' }} />;
}

function PortalGunView({ nav }: { nav: (p: string) => void }) {
  const [seed, setSeed] = useState(42);
  const [hue, setHue] = useState(50);
  const [chaos, setChaos] = useState(15);
  const [sealed, setSealed] = useState(false);
  const dim = `C-${137 + (seed % 826)}`;
  const color = hue > 66 ? 'blue' : hue > 33 ? 'green' : 'shatter-green';
  const stab = chaos < 30 ? 'stable' : chaos < 70 ? 'wobbly' : 'UNSTABLE';
  return (
    <>
      <Hero icon="fa-hand-spock" title="PORTAL GUN CONFIGURATOR" subtitle="utility://portal-gun" />
      <div className="brow-util">
        <div className="brow-util-cluster">
          <label className="brow-slider">Dimension seed <input type="range" min={0} max={825} value={seed} onChange={(e) => setSeed(Number(e.target.value))} /></label>
          <label className="brow-slider">Portal tint <input type="range" min={0} max={100} value={hue} onChange={(e) => setHue(Number(e.target.value))} /></label>
          <label className="brow-slider">Chaos <input type="range" min={0} max={100} value={chaos} onChange={(e) => setChaos(Number(e.target.value))} /></label>
        </div>
        <div className="brow-out">{dim} · {color} · stability {stab}%</div>
        <div className="brow-actions">
          <button
            className="brow-chip"
            onClick={() => {
              Sound.portalOpen();
              setSealed(true);
            }}
          >
            <i className="fas fa-ring" /> Seal the portal
          </button>
          <button className="brow-chip" onClick={() => { setSeed(Math.floor(Math.random() * 826)); }}>
            <i className="fas fa-shuffle" /> Roll another dimension
          </button>
          <button className="brow-chip" onClick={() => nav('ricknet://utils')}>
            <i className="fas fa-toolbox" /> More tools
          </button>
        </div>
        {sealed && <p className="brow-note">PORTAL SEALED. Destination reserved for 6 hours. Bring a backup Morty, this one has a cold.</p>}
      </div>
    </>
  );
}

function MeeseeksView({ nav }: { nav: (p: string) => void }) {
  const [wishes, setWishes] = useState(0);
  const line = MEESEKS_LINES[Math.min(wishes, MEESEKS_LINES.length - 1)];
  return (
    <>
      <Hero icon="fa-box-open" title="MR. MEESEEKS-A-MIMIC" subtitle="utility://meeseeks" />
      <div className="brow-util">
        <img src={AV(242)} alt="Mr. Meeseeks" style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 14, border: '1px solid var(--line)' }} />
        <div className="brow-out">{line}</div>
        <div className="brow-actions">
          <button className="brow-chip" onClick={() => { Sound.click(); setWishes((w) => w + 1); }}>
            <i className="fas fa-hand-pointer" /> PRESESS TO REQUEST SERVICE
          </button>
        </div>
        <p className="brow-note">Wishes granted: {wishes}. Remember: once summoned, a Meeseeks must complete a task to stop existing. Jerry summoned 47 for help setting up a tent.</p>
      </div>
    </>
  );
}

function PlumbusView({ nav }: { nav: (p: string) => void }) {
  const [built, setBuilt] = useState(0);
  return (
    <>
      <Hero icon="fa-hammer" title="PLUMBUS OWNER'S MANUAL" subtitle="utility://plumbus" />
      <div className="brow-util">
        <div className="brow-note" style={{ margin: 0 }}>
          <p>In the first episode, Rick can be heard saying, "It's a plumbus." They've been able to mass produce them since. Every home has at least one.</p>
          <p style={{ marginTop: 8 }}>First, you take the dinglebop, and you smooth it out with a bunch of schleem. The schleem is then repurposed for later batches.</p>
          <p style={{ marginTop: 8 }}>Take the dinglebop and push it through the grumbo, where the fleeb is rubbed against it. It's important that's fleeb is rubbed, because the fleeb has all the fleeb juice. Then, a ploobis, and a grumbo.</p>
        </div>
        <div className="brow-actions">
          <button className="brow-chip" onClick={() => { Sound.success(); setBuilt((b) => b + 1); }}>
            <i className="fas fa-hammer" /> Assemble plumbus
          </button>
          <button className="brow-chip" onClick={() => nav('ricknet://utils')}>
            <i className="fas fa-toolbox" /> More tools
          </button>
        </div>
        {built > 0 && <p className="brow-note">You have assembled {built} plumbus{built === 1 ? '' : 'es'}. It's the most normal thing in this OS.</p>}
      </div>
    </>
  );
}

const DIM_LIST = ['C-137', 'J19-Zeta7', 'K-22', 'D-99', 'R-491', 'Squanch Prime', 'Tiny Rick Auction', 'Claw and Hoarder', 'Bird World', 'Planet Squanch', 'Earth (Fascist)', 'Earth (Replacement)'];

function DimView({ nav }: { nav: (p: string) => void }) {
  const [dim] = useState(() => [...DIM_LIST].sort(() => Math.random() - 0.5));
  const first = dim[0] ?? 'C-137';
  return (
    <>
      <Hero icon="fa-map" title="DIMENSION ACCESS CODES" subtitle="utility://dims" />
      <div className="brow-util">
        <div className="brow-out">Current anchor: {first}</div>
        <div className="brow-chips" style={{ maxWidth: 560 }}>
          {dim.slice(0, 8).map((d) => <span className="brow-badge" key={d}>{d}</span>)}
        </div>
        <div className="brow-actions">
          <button className="brow-chip" onClick={() => nav('utility://portal-gun')}>
            <i className="fas fa-ring" /> Tune the portal gun
          </button>
          <button className="brow-chip" onClick={() => nav('ricknet://utils')}>
            <i className="fas fa-toolbox" /> More tools
          </button>
        </div>
      </div>
    </>
  );
}

function EggView({ egg, nav }: { egg: string; nav: (p: string) => void }) {
  if (egg === 'schwifty') return <SchwiftyEgg nav={nav} />;
  if (egg === 'pickle') return <PickleEgg nav={nav} />;
  if (egg === 'evil') return <EvilEgg nav={nav} />;
  if (egg === 'wubba') return <WubbaEgg nav={nav} />;
  if (egg === 'szechuan') return <SzechuanEgg nav={nav} />;
  if (egg === 'jerry') return <JerryEgg nav={nav} />;
  if (egg === 'ratatouille') return <RatatouilleEgg nav={nav} />;
  return <HomeView nav={nav} go={nav} />;
}

function SchwiftyEgg({ nav }: { nav: (p: string) => void }) {
  const [n, setN] = useState(0);
  return (
    <div className="brow-egg green">
      <i className="fas fa-music" style={{ fontSize: 48, color: 'var(--accent)' }} />
      <h2 className="brow-dance">GET SCHWIFTY!!</h2>
      <p className="brow-tagline">Everyone get down, it's time to party! Dance count: {n}</p>
      <div className="brow-actions">
        <button className="brow-chip" onClick={() => { Sound.portalOpen(); setN((x) => x + 1); }}>
          <i className="fas fa-headphones" /> SCHWIFTY​ THE BEEP BOOP BEEP
        </button>
        <button className="brow-chip" onClick={() => nav('schwifty://radio')}>
          <i className="fas fa-radio" /> Schwifty Radio
        </button>
      </div>
    </div>
  );
}

function PickleEgg({ nav }: { nav: (p: string) => void }) {
  const [flavor, setFlavor] = useState('dill');
  return (
    <div className="brow-egg">
      <img src={AV(265)} alt="Pickle Rick" style={{ width: 130, height: 130, objectFit: 'cover', borderRadius: 18, border: '1px solid var(--line)' }} />
      <h2>PICKLE RICK</h2>
      <p className="brow-tagline">"I turned myself into a pickle, Morty. Funniest shit I've ever seen." — flavor: {flavor}</p>
      <div className="brow-actions">
        <button className="brow-chip" onClick={() => { Sound.success(); setFlavor('dill 2.0'); }}>
          <i className="fas fa-stroopwafel" /> Request pickle rick
        </button>
        <button className="brow-chip" onClick={() => { Sound.error(); setFlavor('Toxic (do not)'); }}>
          <i className="fas fa-biohazard" /> Request toxic pickle
        </button>
        <button className="brow-chip" onClick={() => nav('citadel://characters')}>
          <i className="fas fa-id-card" /> More dossiers
        </button>
      </div>
    </div>
  );
}

function EvilEgg({ nav }: { nav: (p: string) => void }) {
  const os = useOs();
  return (
    <div className="brow-egg red">
      <i className="fas fa-triangle-exclamation" style={{ fontSize: 44, color: '#ff3b5c' }} />
      <h2>CLASSIFIED</h2>
      <div className="brow-warn">
        CITADEL OFFICIAL RECORD. EVIL MORTY DOSSIER BEHIND THIS PORTAL. If you isolate the portal, he'll be a political nightmare.
        This page knows where your parents are. Do not download anything.
      </div>
      <div className="brow-actions">
        <button
          className="brow-chip"
          onClick={() => {
            Sound.error();
            os.notify('Nice try', 'That "evil-morty.exe" is a scam, Morty. You almost clicked it.', '🚨');
          }}
        >
          <i className="fas fa-download" /> Download evil-morty.exe
        </button>
        <button className="brow-chip" onClick={() => nav('citadel://characters')}>
          <i className="fas fa-chevron-left" /> Back to safety
        </button>
      </div>
      <img src={AV(118)} alt="Evil Morty" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 14, border: '1px solid rgba(255,59,92,.4)' }} />
    </div>
  );
}

function WubbaEgg({ nav }: { nav: (p: string) => void }) {
  const os = useOs();
  return (
    <div className="brow-egg">
      <h2>WUBBA LUBBA DUB DUB!!</h2>
      <p className="brow-tagline">Roughly translated: "I am in great pain, please help me."</p>
      <button className="brow-chip" onClick={() => { Sound.click(); os.notify('Help request', 'Help is on the way... just kidding, nobody is coming.', '🆘'); }}>
        <i className="fas fa-hand-holding-heart" /> Offer help
      </button>
    </div>
  );
}

function SzechuanEgg({ nav }: { nav: (p: string) => void }) {
  return (
    <div className="brow-egg">
      <h2>SZECHUAN SAUCE</h2>
      <p className="brow-tagline">"One flavor to rule them all. I'm not crying, it's just been raining on my face."</p>
      <p className="brow-tagline">1998 McDonald's promotional recipe. The last batch went through a portal to a dimension where it doesn't exist. Rick is extremely annoyed.</p>
      <div className="brow-actions">
        <button className="brow-chip" onClick={() => { Sound.portalOpen(); }}>
          <i className="fas fa-drumstick-bite" /> Order the sauce
        </button>
        <button className="brow-chip" onClick={() => nav('galactic://flavor')}>
          <i className="fas fa-utensils" /> Galactic Recipe
        </button>
      </div>
    </div>
  );
}

function JerryEgg({ nav }: { nav: (p: string) => void }) {
  const [i, setI] = useState(0);
  return (
    <div className="brow-egg">
      <img src={AV(5)} alt="Jerry Smith" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 18, border: '1px solid var(--line)' }} />
      <h2>JERRY</h2>
      <p className="brow-tagline">{JERRY_LINES[i % JERRY_LINES.length]}</p>
      <button className="brow-chip" onClick={() => { Sound.click(); setI((x) => x + 1); }}>
        <i className="fas fa-tent" /> Ask Jerry something
      </button>
    </div>
  );
}

function RatatouilleEgg({ nav }: { nav: (p: string) => void }) {
  return (
    <div className="brow-egg">
      <h2>RATATOUILLE</h2>
      <p className="brow-tagline">The least dangerous thing we could have done. And yet. Ratatouille the movie, the ratatouille the song, the ratatouille the rat. Not the dish?</p>
      <button className="brow-chip" onClick={() => nav('citadel://news')}>
        <i className="fas fa-newspaper" /> Read the news
      </button>
    </div>
  );
}

function FirewallView({ go, url }: { go: (e: string) => void; url: string }) {
  const hint = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `http://${url}`;
  return (
    <>
      <Hero icon="fa-shield-halved" title="INTERDIMENSIONAL FIREWALL" subtitle="fw blocked" />
      <div className="brow-note">
        <p>The Galactic Net's firewall refuses that address: <b style={{ fontFamily: 'JetBrains Mono, monospace' }}>{hint}</b></p>
        <p style={{ marginTop: 8 }}>Earth's internet is locked behind an interdimensional wall — Rick says "sorry, Morty, the internet's down." Also: {rickQuote()}</p>
      </div>
      <div className="brow-actions">
        <button className="brow-chip" onClick={() => go('home')}>
          <i className="fas fa-home" /> Back to Portal Search
        </button>
        <button className="brow-chip" onClick={() => go('portal://search?q=schwifty')}>
          <i className="fas fa-music" /> Do the safe thing
        </button>
      </div>
    </>
  );
}