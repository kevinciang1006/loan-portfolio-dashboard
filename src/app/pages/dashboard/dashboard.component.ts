import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog.component';
import { LoanChartComponent } from '../../components/loan-chart/loan-chart.component';
import { LoanTableComponent } from '../../components/loan-table/loan-table.component';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { Loan } from '../../mock/loans.mock';
import { LoanService } from '../../services/loan.service';

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
  readonly localLoans = signal<Loan[]>([]);

  readonly filteredLoans = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const loans = this.localLoans();
    if (!q) return loans;
    return loans.filter(
      (l) =>
        l.borrower.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  });

  readonly totalLoans = computed(() => this.filteredLoans().length);

  readonly activeLoans = computed(
    () => this.filteredLoans().filter((l) => l.status === 'Active').length
  );

  readonly defaultRate = computed(() => {
    const loans = this.filteredLoans();
    if (!loans.length) return 0;
    return (
      Math.round(
        (loans.filter((l) => l.status === 'Default').length / loans.length) *
          100 *
          10
      ) / 10
    );
  });

  readonly avgLoanSize = computed(() => {
    const loans = this.filteredLoans();
    if (!loans.length) return 0;
    return Math.round(
      loans.reduce((s, l) => s + l.amount, 0) / loans.length
    );
  });

  readonly avgLoanSizeFormatted = computed(() => {
    const v = this.avgLoanSize();
    if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(1) + 'M';
    if (v >= 1_000)     return '$' + (v / 1_000).toFixed(1) + 'k';
    return '$' + v;
  });

  readonly chartData = computed(() => {
    const loans = this.filteredLoans();
    return (['Residential', 'Commercial', 'Auto', 'Personal'] as const).map(
      (t) => loans.filter((l) => l.type === t).length
    );
  });

  constructor() {
    // Load loans from service — swap getLoans() implementation for real HTTP
    this.loanService.getLoans().subscribe((loans) => {
      this.localLoans.set(loans);
      this.isLoading.set(false);
    });

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
      // Optimistic update: remove from UI immediately, then confirm with API
      this.localLoans.update((loans) => loans.filter((l) => l.id !== loan.id));
      this.loanService.deleteLoan(loan.id).subscribe();
    });
  }
}
