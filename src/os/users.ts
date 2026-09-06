export interface OsUser {
  id: string;
  name: string;
  role: string;
  icon: string;
  accent: string;
  greeting: string;
  subtitle: string;
}

export const USERS: OsUser[] = [
  {
    id: 'rick',
    name: 'Rick Sanchez',
    role: 'C-137 · Scientist',
    icon: 'fa-user-astronaut',
    accent: '#00ff41',
    greeting: 'Wubba lubba dub dub!',
    subtitle: 'The smartest man in every dimension',
  },
  {
    id: 'morty',
    name: 'Morty Smith',
    role: 'C-137 · Assistant',
    icon: 'fa-user-graduate',
    accent: '#ffd700',
    greeting: 'Oh jeez... hi Rick.',
    subtitle: 'Aw geez, thanks for using my crayon computer',
  },
  {
    id: 'summer',
    name: 'Summer Smith',
    role: 'C-137 · Popstar',
    icon: 'fa-star',
    accent: '#ff7b9c',
    greeting: 'Get schwifty or get out!',
    subtitle: 'Seasoned adventurer, occasional planet god',
  },
  {
    id: 'beth',
    name: 'Beth Smith',
    role: 'C-137 · Horse Surgeon',
    icon: 'fa-user-md',
    accent: '#00d4ff',
    greeting: 'I diagnose horses and deficiencies.',
    subtitle: 'Mom, surgeon, clone-coordinator',
  },
];

export function getUser(id: string): OsUser {
  return USERS.find((u) => u.id === id) ?? USERS[0];
}