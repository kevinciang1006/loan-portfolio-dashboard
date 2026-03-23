import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Loan, MOCK_LOANS } from '../mock/loans.mock';

/**
 * LoanService — data access layer for loan records.
 *
 * Currently backed by in-memory mock data to simulate network latency.
 * To connect a real REST API, replace each `of(...)` stub with the
 * corresponding HttpClient call, for example:
 *
 *   getLoans():      this.http.get<Loan[]>(`${environment.apiUrl}/loans`)
 *   deleteLoan(id):  this.http.delete<void>(`${environment.apiUrl}/loans/${id}`)
 *
 * No changes to the dashboard or any other consumer are required —
 * they all depend on the Observable contract, not the implementation.
 */
@Injectable({ providedIn: 'root' })
export class LoanService {
  /** GET /api/loans — returns the full loan portfolio. */
  getLoans(): Observable<Loan[]> {
    // Simulate ~400 ms network round-trip.
    // Swap with: return this.http.get<Loan[]>(`${environment.apiUrl}/loans`);
    return of([...MOCK_LOANS]).pipe(delay(400));
  }

  /** DELETE /api/loans/:id — removes a single loan record. */
  deleteLoan(id: string): Observable<void> {
    // Simulate ~200 ms network round-trip.
    // Swap with: return this.http.delete<void>(`${environment.apiUrl}/loans/${id}`);
    return of(undefined as void).pipe(delay(200));
  }
}
