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
}

export type Category = 'agriculture' | 'medical' | 'education' | 'housing' | 'business';

export interface CategoryInfo {
  key: Category;
  icon: string;
  label: string;
  count: number;
}

export const categories: CategoryInfo[] = [
  { key: 'agriculture', icon: '🌾', label: 'Agriculture & Farming', count: 142 },
  { key: 'medical',     icon: '🏥', label: 'Medical Emergencies',  count: 89 },
  { key: 'education',   icon: '📚', label: 'Education & Skill Building', count: 203 },
  { key: 'housing',     icon: '🏠', label: 'Home & Housing',       count: 76 },
  { key: 'business',    icon: '💼', label: 'Small Business',       count: 118 },
];

export const borrowerProfiles: BorrowerProfile[] = [
  // ── Agriculture ──
  { id: 'agr-1', name: 'Ramesh Patel',           state: 'Gujarat',          amount: 18000, reason: 'Drip irrigation system',       fundedPct: 78, trustScore: 82, lenderCount: 3, category: 'agriculture' },
  { id: 'agr-2', name: 'Sunita Devi',            state: 'Bihar',            amount: 12000, reason: 'Seed & fertilizer stock',      fundedPct: 45, trustScore: 71, lenderCount: 2, category: 'agriculture' },
  { id: 'agr-3', name: 'Kiran Rao',              state: 'Andhra Pradesh',   amount: 25000, reason: 'Tractor rental deposit',       fundedPct: 91, trustScore: 88, lenderCount: 5, category: 'agriculture' },
  { id: 'agr-4', name: 'Mohammed Yusef',         state: 'Rajasthan',        amount: 9500,  reason: 'Goat farming expansion',       fundedPct: 20, trustScore: 65, lenderCount: 1, category: 'agriculture' },
  // ── Medical ──
  { id: 'med-1', name: 'Priya Nair',             state: 'Kerala',           amount: 30000, reason: "Father's cataract surgery",    fundedPct: 60, trustScore: 90, lenderCount: 7, category: 'medical' },
  { id: 'med-2', name: 'Arvind Gupta',           state: 'MP',               amount: 22000, reason: 'Diabetes medication 6mo',      fundedPct: 33, trustScore: 74, lenderCount: 3, category: 'medical' },
  { id: 'med-3', name: 'Fatima Shaikh',          state: 'Maharashtra',      amount: 15000, reason: 'Child physiotherapy',          fundedPct: 88, trustScore: 85, lenderCount: 4, category: 'medical' },
  { id: 'med-4', name: 'Deepak Sharma',          state: 'UP',               amount: 40000, reason: 'Knee replacement surgery',     fundedPct: 12, trustScore: 61, lenderCount: 1, category: 'medical' },
  // ── Education ──
  { id: 'edu-1', name: 'Ananya Mishra',          state: 'Odisha',           amount: 8000,  reason: 'UPSC coaching fees',           fundedPct: 95, trustScore: 93, lenderCount: 9, category: 'education' },
  { id: 'edu-2', name: 'Raju Verma',             state: 'Jharkhand',        amount: 14000, reason: 'ITI welding course',           fundedPct: 67, trustScore: 79, lenderCount: 5, category: 'education' },
  { id: 'edu-3', name: 'Pooja Iyer',             state: 'TN',               amount: 20000, reason: 'Nursing entrance exam prep',   fundedPct: 40, trustScore: 76, lenderCount: 3, category: 'education' },
  { id: 'edu-4', name: 'Sanjay Das',             state: 'West Bengal',      amount: 11000, reason: 'Computer hardware diploma',    fundedPct: 22, trustScore: 68, lenderCount: 2, category: 'education' },
  { id: 'edu-5', name: 'Meena Kumari',           state: 'Haryana',          amount: 16000, reason: 'B.Ed admission fees',          fundedPct: 55, trustScore: 80, lenderCount: 4, category: 'education' },
  // ── Housing ──
  { id: 'hou-1', name: 'Vikram Singh',           state: 'Punjab',           amount: 35000, reason: 'Roof repair before monsoon',   fundedPct: 70, trustScore: 84, lenderCount: 6, category: 'housing' },
  { id: 'hou-2', name: 'Geeta Yadav',            state: 'UP',               amount: 18000, reason: 'Kitchen renovation',           fundedPct: 38, trustScore: 72, lenderCount: 2, category: 'housing' },
  { id: 'hou-3', name: 'Abdul Karim',            state: 'Karnataka',        amount: 28000, reason: 'Bathroom & plumbing fix',      fundedPct: 82, trustScore: 87, lenderCount: 5, category: 'housing' },
  { id: 'hou-4', name: 'Lata Patil',             state: 'Maharashtra',      amount: 12000, reason: 'Window grills & safety',       fundedPct: 15, trustScore: 60, lenderCount: 1, category: 'housing' },
  // ── Small Business ──
  { id: 'biz-1', name: 'Rohit Agarwal',          state: 'Delhi',            amount: 45000, reason: 'Mobile repair shop stock',     fundedPct: 85, trustScore: 91, lenderCount: 8, category: 'business' },
  { id: 'biz-2', name: 'Champa Bai',             state: 'Chhattisgarh',     amount: 10000, reason: 'Pickle & papad business',      fundedPct: 50, trustScore: 77, lenderCount: 4, category: 'business' },
  { id: 'biz-3', name: 'Naveen Reddy',           state: 'Telangana',        amount: 32000, reason: 'Auto-rickshaw financing',      fundedPct: 25, trustScore: 66, lenderCount: 2, category: 'business' },
  { id: 'biz-4', name: 'Jasmine Thomas',         state: 'Goa',              amount: 22000, reason: 'Tailoring shop machines',      fundedPct: 90, trustScore: 89, lenderCount: 6, category: 'business' },
  { id: 'biz-5', name: 'Kamal Kishore',          state: 'Bihar',            amount: 19000, reason: 'Tea stall expansion',          fundedPct: 60, trustScore: 81, lenderCount: 5, category: 'business' },
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
