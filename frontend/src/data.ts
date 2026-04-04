// ── LendPool Static Demo Data ──────────────────────────────────────

export interface BorrowerProfile {
  id: string;
  name: string;
  state: string;
  amount: number;        // in ₹
  reason: string;
  fundedPct: number;     // 0-100
  trustScore: number;
  lenderCount: number;
  category: Category;
  wallet: string;        // Algorand address
}

export type Category = 'agriculture' | 'medical' | 'education' | 'housing' | 'business';

export interface CategoryInfo {
  key: Category;
  icon: string;
  label: string;
  count: number;
}

export const categories: CategoryInfo[] = [
  { key: 'agriculture', icon: 'A', label: 'Agriculture & Farming', count: 142 },
  { key: 'medical',     icon: 'M', label: 'Medical Emergencies',  count: 89 },
  { key: 'education',   icon: 'E', label: 'Education & Skill Building', count: 203 },
  { key: 'housing',     icon: 'H', label: 'Home & Housing',       count: 76 },
  { key: 'business',    icon: 'B', label: 'Small Business',       count: 118 },
];

export const borrowerProfiles: BorrowerProfile[] = [
  // ── Agriculture ──
  { id: 'agr-1', name: 'Ramesh Patel',           state: 'Gujarat',          amount: 18000, reason: 'Drip irrigation system',       fundedPct: 78, trustScore: 82, lenderCount: 3, category: 'agriculture', wallet: 'RAMESHPATEL6X2Y...Z' },
  // ── Medical ──
  { id: 'med-1', name: 'Priya Nair',             state: 'Kerala',           amount: 30000, reason: "Father's cataract surgery",    fundedPct: 60, trustScore: 90, lenderCount: 7, category: 'medical', wallet: 'PRIYANAIR2X4Y...Z' },
  // ── Education ──
  { id: 'edu-1', name: 'Ananya Mishra',          state: 'Odisha',           amount: 8000,  reason: 'UPSC coaching fees',           fundedPct: 95, trustScore: 93, lenderCount: 9, category: 'education', wallet: 'ANANYAMISHRA5N...M' },
  // ── Small Business ──
  { id: 'biz-1', name: 'Rohit Agarwal',          state: 'Delhi',            amount: 45000, reason: 'Mobile repair shop stock',     fundedPct: 85, trustScore: 91, lenderCount: 8, category: 'business', wallet: 'ROHITAGARWAL9P...W' },
];

// ── Voucher Candidates ──
export interface VoucherCandidate {
  id: string;
  name: string;
  city: string;
  trustScore: number;
  loansBacked: number;
  tagline: string;
  walletPrefix: string;
}

export const voucherCandidates: VoucherCandidate[] = [
  { id: 'v1', name: 'Ravi Kumar',      city: 'Delhi',     trustScore: 88, loansBacked: 12, tagline: 'I vouch for responsible borrowers',           walletPrefix: 'RAVI...K4X2' },
  { id: 'v2', name: 'Sneha Joshi',     city: 'Mumbai',    trustScore: 92, loansBacked: 18, tagline: 'Building community one loan at a time',       walletPrefix: 'SNEH...J9P1' },
  { id: 'v3', name: 'Amit Patel',      city: 'Ahmedabad', trustScore: 85, loansBacked: 9,  tagline: 'Here to help genuine borrowers',              walletPrefix: 'AMIT...P3Q7' },
  { id: 'v4', name: 'Priyanka Singh',  city: 'Pune',      trustScore: 79, loansBacked: 6,  tagline: 'Peer lending made trustworthy',               walletPrefix: 'PRIY...S8R2' },
  { id: 'v5', name: 'Venkat Rao',      city: 'Hyderabad', trustScore: 91, loansBacked: 15, tagline: 'Strong community = strong economy',           walletPrefix: 'VENK...R1M5' },
  { id: 'v6', name: 'Meera Pillai',    city: 'Chennai',   trustScore: 83, loansBacked: 11, tagline: 'Helping hands, verified wallets',              walletPrefix: 'MEER...P6N4' },
];

// ── Testimonials ──
export const testimonials = [
  { text: '"LendPool helped me fund my daughter\'s education when no bank would."', author: 'Sunita D., Bihar' },
  { text: '"I lent ₹5,000 and got every rupee back. The transparency is unreal."', author: 'Ravi K., Delhi' },
  { text: '"My trust score unlocked a bigger loan. This system actually rewards good behaviour."', author: 'Kiran R., AP' },
  { text: '"No middlemen, no hidden fees. Just community helping community."', author: 'Priya N., Kerala' },
  { text: '"The blockchain receipts gave me confidence to lend to a stranger."', author: 'Amit P., Ahmedabad' },
  { text: '"Repaid my loan early and my score jumped. Love it!"', author: 'Ananya M., Odisha' },
  { text: '"Finally, a lending platform that treats borrowers with dignity."', author: 'Fatima S., Maharashtra' },
  { text: '"I\'ve backed 18 loans and haven\'t lost a single rupee."', author: 'Sneha J., Mumbai' },
];

// ── Loan Receipts (On-Chain Memory) ──
export interface LoanReceipt {
  id: string;
  borrowerName: string;
  amount: number;
  purpose: string;
  date: string;
  voucherName?: string;
  narrative: string;
  status: 'CLOSED';
  durationMonths: number;
  onTime: number;
  delayed: number;
  totalInstallments: number;
}

export const demoReceipts: LoanReceipt[] = [
  {
    id: 'receipt-1',
    borrowerName: 'Ramesh Patel',
    amount: 18000,
    purpose: 'Drip irrigation system',
    date: '10 Jan 2025',
    voucherName: 'Ravi Kumar',
    narrative: 'Ramesh borrowed ₹18,000 for drip irrigation on 10 Jan 2025. Ravi Kumar vouched. He repaid ₹3,000 early on installment 2, communicated a 5-day delay on installment 4. Completed loan 12 days ahead of schedule. 4 lenders gave 5-star reviews.',
    status: 'CLOSED',
    durationMonths: 6,
    onTime: 5,
    delayed: 1,
    totalInstallments: 6,
  },
  {
    id: 'receipt-2',
    borrowerName: 'Ramesh Patel',
    amount: 12000,
    purpose: 'Seed purchase',
    date: '3 Mar 2024',
    narrative: 'Ramesh borrowed ₹12,000 for seed purchase on 3 Mar 2024. All 4 installments paid exactly on schedule. 3 lenders. Repaid in full.',
    status: 'CLOSED',
    durationMonths: 4,
    onTime: 4,
    delayed: 0,
    totalInstallments: 4,
  },
];

// ── Demo Installment Schedule ──
export type InstallmentStatus = 'paid' | 'paid-late' | 'upcoming' | 'overdue';

export interface Installment {
  number: number;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  delayDays?: number;
}

export const demoInstallments: Installment[] = [
  { number: 1, dueDate: '15 Jan 2025', amount: 3200, status: 'paid' },
  { number: 2, dueDate: '15 Feb 2025', amount: 3200, status: 'paid' },
  { number: 3, dueDate: '15 Mar 2025', amount: 3200, status: 'paid' },
  { number: 4, dueDate: '15 Apr 2025', amount: 3200, status: 'paid-late', delayDays: 5 },
  { number: 5, dueDate: '15 May 2025', amount: 3200, status: 'upcoming' },
  { number: 6, dueDate: '15 Jun 2025', amount: 3200, status: 'upcoming' },
];

// ── Demo Lender Activity ──
export interface LenderActivity {
  name: string;
  amount: number;
  timeAgo: string;
}

export const demoLenderActivity: LenderActivity[] = [
  { name: 'Priya N.', amount: 2000, timeAgo: '3 hours ago' },
  { name: 'Amit P.', amount: 5000, timeAgo: '1 day ago' },
  { name: 'Sneha J.', amount: 3000, timeAgo: '2 days ago' },
  { name: 'Ravi K.', amount: 1500, timeAgo: '3 days ago' },
  { name: 'Venkat R.', amount: 4000, timeAgo: '5 days ago' },
];

// ── Helper: Get initials from name ──
export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Helper: Seeded color from name ──
export function getAvatarColor(name: string): string {
  const colors = [
    '#0d4f3c', '#1a6b4f', '#2d8a6e', '#c8972b', '#b5841f',
    '#8b6914', '#2d3748', '#4a5568', '#744210', '#285e61',
    '#553c9a', '#9b2c2c', '#2c5282', '#276749',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ── Helper: Trust score color ──
export function getTrustColor(score: number): string {
  if (score >= 80) return '#0d4f3c';
  if (score >= 60) return '#c8972b';
  return '#dc2626';
}

// ── Helper: Risk score color (lower is better) ──
export function getRiskColor(score: number): string {
  if (score <= 20) return '#0d4f3c';
  if (score <= 40) return '#c8972b';
  return '#dc2626';
}

// ── Helper: Format currency ──
export function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
