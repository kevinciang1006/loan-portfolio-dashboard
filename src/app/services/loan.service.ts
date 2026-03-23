import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Loan, LoanType, LoanTypeStat, LOAN_TYPE_CONFIG, PortfolioDashboard } from '../models/loan.model';
import { MOCK_LOANS } from '../mock/loans.mock';

/**
 * LoanService — data access layer for the loan portfolio dashboard.
 *
 * Currently backed by in-memory mock data to simulate network latency.
 * To connect a real REST API, replace each `of(...)` stub with the
 * corresponding HttpClient call:
 *
 *   getDashboard(q): this.http.get<PortfolioDashboard>(`${environment.apiUrl}/dashboard`, { params: { q } })
 *   deleteLoan(id):  this.http.delete<void>(`${environment.apiUrl}/loans/${id}`)
 *
 * No changes to the dashboard component are required —
 * it depends on the Observable contract, not the implementation.
 */
@Injectable({ providedIn: 'root' })
export class LoanService {
  /**
   * GET /api/dashboard?q=...
   *
   * Returns all data needed to render the dashboard in a single response.
   * The backend filters loans by `q` and recomputes KPIs so every card,
   * chart, and table row stays consistent with each other.
   *
   * Trends are period-over-period deltas computed server-side — they are
   * not affected by the search query.
   */
  getDashboard(query = ''): Observable<PortfolioDashboard> {
    // Swap with: return this.http.get<PortfolioDashboard>(`${environment.apiUrl}/dashboard`, { params: { q: query } });

    const q = query.toLowerCase().trim();
    const all = MOCK_LOANS;
    const filtered: Loan[] = q
      ? all.filter(l =>
          l.borrower.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
        )
      : all;

    const activeCount  = filtered.filter(l => l.status === 'active').length;
    const defaultCount = filtered.filter(l => l.status === 'default').length;
    const totalAmount  = filtered.reduce((s, l) => s + l.amount, 0);
    const avgLoanSize  = filtered.length ? Math.round(totalAmount / filtered.length) : 0;
    const defaultRate  = filtered.length
      ? Math.round((defaultCount / filtered.length) * 1000) / 10
      : 0;

    const loanTypeStats: LoanTypeStat[] = (Object.keys(LOAN_TYPE_CONFIG) as LoanType[]).map(type => ({
      type,
      count: filtered.filter(l => l.type === type).length,
    }));

    return of({
      summary: {
        totalLoans:          filtered.length,
        activeLoans:         activeCount,
        defaultRate,
        avgLoanSize,
        totalPortfolioCount: all.length,
        // Period-over-period trends — fixed in mock, computed by backend in production
        totalLoansTrend:   3.2,
        activeLoansTrend:  1.8,
        defaultRateTrend: -0.5,
        avgLoanSizeTrend:  4.1,
      },
      loanTypeStats,
      loans: filtered,
    } satisfies PortfolioDashboard).pipe(delay(300));
  }

  /** DELETE /api/loans/:id — removes a single loan record. */
  deleteLoan(id: string): Observable<void> {
    // Swap with: return this.http.delete<void>(`${environment.apiUrl}/loans/${id}`);
    return of(undefined as void).pipe(delay(200));
  }
}
