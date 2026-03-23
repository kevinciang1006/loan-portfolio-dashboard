// ──────────────────────────────────────────────────────────────────────
// Loan domain model — API contract layer
//
// These types define EXACTLY what the backend API delivers.
// Any backend engineer reading this file knows the field names,
// enum values, and data shapes required for the UI to work.
//
// API endpoints (expected):
//   GET    /api/loans           → Loan[]
//   DELETE /api/loans/:id       → void
//
// UI mapping constants (LOAN_TYPE_CONFIG, LOAN_STATUS_CONFIG) live
// here alongside the types so the contract is self-contained:
// "backend delivers 'residential', frontend renders 'Residential' in
// a green doughnut slice."
// ──────────────────────────────────────────────────────────────────────

/** Lowercase string enum matching the `type` field from the API. */
export type LoanType = 'residential' | 'commercial' | 'auto' | 'personal';

/** Lowercase string enum matching the `status` field from the API. */
export type LoanStatus = 'active' | 'closed' | 'default' | 'review';

/** Shape of a single loan record as returned by GET /api/loans. */
export interface Loan {
  id: string;
  borrower: string;
  amount: number;
  /** Annual interest rate, e.g. 4.75 means 4.75%. */
  rate: number;
  status: LoanStatus;
  /** ISO 8601 date string, e.g. "2023-06-15". */
  date: string;
  type: LoanType;
}

// ──────────────────────────────────────────────────────────────────────
// UI display config
// Single source of truth: backend enum value → display label + color.
// The chart and table derive their labels and colors from here —
// adding a new loan type only requires adding one entry below.
// ──────────────────────────────────────────────────────────────────────

export const LOAN_TYPE_CONFIG: Record<LoanType, { label: string; color: string }> = {
  residential: { label: 'Residential', color: '#639922' },
  commercial:  { label: 'Commercial',  color: '#3789dd' },
  auto:        { label: 'Auto',        color: '#ef9e29' },
  personal:    { label: 'Personal',    color: '#d3547e' },
};

export const LOAN_STATUS_CONFIG: Record<LoanStatus, { label: string }> = {
  active:  { label: 'Active'  },
  closed:  { label: 'Closed'  },
  default: { label: 'Default' },
  review:  { label: 'Review'  },
};

/**
 * Aggregated count per loan type — shape passed to LoanChartComponent.
 * A dedicated backend endpoint could return this directly:
 *   GET /api/loans/stats → LoanTypeStat[]
 */
export interface LoanTypeStat {
  type: LoanType;
  count: number;
}

/**
 * Full dashboard payload returned by a single GET /api/dashboard?q=...
 *
 * The backend (or BFF) aggregates everything the dashboard page needs into
 * one response. The frontend is a thin renderer — it receives this object
 * and feeds each slice to the appropriate component.
 *
 * The `q` query param is passed by the frontend on every search; the backend
 * filters loans and recomputes the KPIs so all cards and the chart stay in sync.
 *
 * Trend fields are period-over-period deltas computed server-side (e.g.
 * current month vs previous month). They are not affected by the search query.
 */
export interface PortfolioDashboard {
  summary: {
    /** Number of loans matching the current search query. */
    totalLoans: number;
    activeLoans: number;
    /** Default rate as a percentage, e.g. 2.4 means 2.4%. */
    defaultRate: number;
    /** Average loan amount in dollars (raw number — frontend formats display). */
    avgLoanSize: number;
    /** Full portfolio count (unfiltered) — used by the chart coverage percentage. */
    totalPortfolioCount: number;
    // Period-over-period deltas — positive = growth, negative = decline
    totalLoansTrend: number;
    activeLoansTrend: number;
    defaultRateTrend: number;
    avgLoanSizeTrend: number;
  };
  /** Type distribution for the doughnut chart, scoped to the search query. */
  loanTypeStats: LoanTypeStat[];
  /** Loan records for the table, filtered by the search query. */
  loans: Loan[];
}
