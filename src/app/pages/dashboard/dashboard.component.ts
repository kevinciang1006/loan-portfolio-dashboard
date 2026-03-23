import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog.component';
import { LoanChartComponent } from '../../components/loan-chart/loan-chart.component';
import { LoanTableComponent } from '../../components/loan-table/loan-table.component';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { Loan, LoanTypeStat, PortfolioDashboard } from '../../models/loan.model';
import { LoanService } from '../../services/loan.service';

const EMPTY_DASHBOARD: PortfolioDashboard = {
  summary: {
    totalLoans: 0, activeLoans: 0, defaultRate: 0, avgLoanSize: 0,
    totalPortfolioCount: 0,
    totalLoansTrend: 0, activeLoansTrend: 0, defaultRateTrend: 0, avgLoanSizeTrend: 0,
  },
  loanTypeStats: [] as LoanTypeStat[],
  loans: [] as Loan[],
};

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    SummaryCardComponent,
    LoanTableComponent,
    LoanChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly dialog = inject(MatDialog);
  private readonly loanService = inject(LoanService);

  readonly searchQuery = signal('');
  readonly isDark = signal(false);
  readonly isLoading = signal(true);

  /**
   * Tracks IDs deleted client-side so the row disappears immediately
   * without waiting for a re-fetch (optimistic update pattern).
   */
  readonly deletedIds = signal(new Set<string>());

  /**
   * Single API call: search query → PortfolioDashboard.
   *
   * toObservable watches the searchQuery signal, debounces user keystrokes
   * at 300 ms, then switchMaps to getDashboard() so in-flight requests are
   * automatically cancelled when a newer query arrives.
   *
   * To swap to a real backend, change getDashboard() in LoanService —
   * this component does not need to change.
   */
  private readonly dashboard$ = toObservable(this.searchQuery).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.isLoading.set(true)),
    switchMap(q => this.loanService.getDashboard(q)),
    tap(() => this.isLoading.set(false)),
  );

  readonly dashboard = toSignal(this.dashboard$, { initialValue: EMPTY_DASHBOARD });

  /** Frontend formatting of the raw avgLoanSize number from the API. */
  readonly avgLoanSizeFormatted = computed(() => {
    const v = this.dashboard().summary.avgLoanSize;
    if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000)     return '$' + (v / 1_000).toFixed(1) + 'k';
    return '$' + v;
  });

  /** Loans from the API minus any optimistic local deletions. */
  readonly displayLoans = computed(() =>
    this.dashboard().loans.filter(l => !this.deletedIds().has(l.id))
  );

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDark.set(true);
      document.body.classList.add('dark');
    }
    effect(() => {
      document.body.classList.toggle('dark', this.isDark());
      localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
    });
  }

  openDeleteDialog(loan: Loan): void {
    const ref = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      { data: { loan } }
    );
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      // Optimistic: remove from view immediately; API call confirms server-side
      this.deletedIds.update(ids => new Set([...ids, loan.id]));
      this.loanService.deleteLoan(loan.id).subscribe();
    });
  }
}
