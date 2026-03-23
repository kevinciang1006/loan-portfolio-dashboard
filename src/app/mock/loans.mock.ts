export interface Loan {
  id: string;
  borrower: string;
  amount: number;
  rate: number;
  status: 'Active' | 'Closed' | 'Default' | 'Review';
  date: string;
  type: 'Residential' | 'Commercial' | 'Auto' | 'Personal';
}

// Seeded LCG — deterministic, no external deps
function mkRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 0x100000000;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function generateLoans(): Loan[] {
  const rng = mkRng(42);

  // ── Exact counts to match spec ──────────────────────────────
  // Total: 1,247 | Active: 984 | Default: 30 (~2.4%) | Closed: 150 | Review: 83
  // Type:  Residential 499 (40%) | Commercial 436 (35%) | Auto 187 (15%) | Personal 125 (10%)

  const statuses: Array<Loan['status']> = [
    ...Array<Loan['status']>(984).fill('Active'),
    ...Array<Loan['status']>(30).fill('Default'),
    ...Array<Loan['status']>(150).fill('Closed'),
    ...Array<Loan['status']>(83).fill('Review'),
  ];

  const types: Array<Loan['type']> = [
    ...Array<Loan['type']>(499).fill('Residential'),
    ...Array<Loan['type']>(436).fill('Commercial'),
    ...Array<Loan['type']>(187).fill('Auto'),
    ...Array<Loan['type']>(125).fill('Personal'),
  ];

  shuffle(statuses, rng);
  shuffle(types, rng);

  const firstNames = ['James','Mary','John','Patricia','Robert','Jennifer','Michael',
    'Linda','William','Barbara','David','Susan','Richard','Jessica','Joseph','Sarah',
    'Thomas','Karen','Charles','Lisa','Mark','Nancy','Donald','Betty','Paul','Sandra',
    'Andrew','Ashley','Kenneth','Dorothy','Daniel','Kimberly','Anthony','Emily',
    'Kevin','Donna','Jason','Michelle','Matthew','Carol'];

  const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller',
    'Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson',
    'Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White',
    'Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen',
    'King','Wright','Scott','Torres','Nguyen','Hill','Flores'];

  const companies = ['Acme Corp','Pinnacle LLC','Summit Holdings','Nexus Capital',
    'Crestview Partners','Meridian Group','Apex Ventures','Harbor Bay Ltd',
    'Skyline Industries','Pacific Realty','Atlas Development','Bridgepoint Capital',
    'Coastal Properties','Delta Enterprises','Eagle Rock Holdings','Frontier Realty',
    'Gateway Commercial','Hillside Group','Ironwood Ventures','Juniper Partners'];

  const loans: Loan[] = [];
  const startMs = new Date('2019-01-01').getTime();
  const spanMs  = new Date('2024-12-31').getTime() - startMs;

  for (let i = 0; i < 1247; i++) {
    const type   = types[i];
    const status = statuses[i];

    // Amount ranges tuned so portfolio avg ≈ $284,500
    // Residential avg ~$430k, Commercial ~$290k, Auto ~$38k, Personal ~$55k
    let amount: number;
    let rate: number;

    switch (type) {
      case 'Residential':
        amount = Math.round((186000 + rng() * 510000) / 500) * 500;
        rate   = Math.round((3.25 + rng() * 4.75) * 100) / 100;
        break;
      case 'Commercial':
        amount = Math.round((100000 + rng() * 380000) / 1000) * 1000;
        rate   = Math.round((4.00 + rng() * 5.50) * 100) / 100;
        break;
      case 'Auto':
        amount = Math.round((12000 + rng() * 52000) / 500) * 500;
        rate   = Math.round((4.50 + rng() * 7.50) * 100) / 100;
        break;
      case 'Personal':
      default:
        amount = Math.round((5000 + rng() * 100000) / 500) * 500;
        rate   = Math.round((6.00 + rng() * 10.00) * 100) / 100;
        break;
    }

    const borrower = type === 'Commercial'
      ? pick(companies, rng)
      : `${pick(firstNames, rng)} ${pick(lastNames, rng)}`;

    const date = new Date(startMs + rng() * spanMs).toISOString().slice(0, 10);

    loans.push({ id: `LN-${String(i + 1).padStart(4, '0')}`, borrower, amount, rate, status, date, type });
  }

  return loans;
}

export const MOCK_LOANS: Loan[] = generateLoans();
