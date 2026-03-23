import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog.component';
import { LoanChartComponent } from '../../components/loan-chart/loan-chart.component';
import { LoanTableComponent } from '../../components/loan-table/loan-table.component';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { Loan, MOCK_LOANS } from '../../mock/loans.mock';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    CurrencyPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
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

  readonly searchQuery = signal('');
  readonly isDark = signal(false);
  readonly localLoans = signal<Loan[]>([...MOCK_LOANS]);

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

  readonly chartData = computed(() => {
    const loans = this.filteredLoans();
    return (['Residential', 'Commercial', 'Auto', 'Personal'] as const).map(
      (t) => loans.filter((l) => l.type === t).length
    );
  });

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
      if (confirmed) {
        this.localLoans.update((loans) => loans.filter((l) => l.id !== loan.id));
      }
    });
  }
}
