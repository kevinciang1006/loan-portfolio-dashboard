import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartDataset, ChartOptions } from 'chart.js';
import { LOAN_TYPE_CONFIG, LoanTypeStat } from '../../models/loan.model';

@Component({
  selector: 'app-loan-chart',
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './loan-chart.component.html',
  styleUrls: ['./loan-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanChartComponent {
  /**
   * One entry per loan type, as produced by the dashboard aggregation.
   * If a real backend delivers GET /api/loans/stats, swap the dashboard
   * aggregation with a service call — this component needs no changes.
   */
  data       = input.required<LoanTypeStat[]>();
  totalCount = input.required<number>();

  /** Display labels derived from LOAN_TYPE_CONFIG — single source of truth. */
  readonly chartLabels = computed(() =>
    this.data().map(s => LOAN_TYPE_CONFIG[s.type].label)
  );

  /** Chart colours derived from LOAN_TYPE_CONFIG — adding a type only needs a config entry. */
  readonly chartColors = computed(() =>
    this.data().map(s => LOAN_TYPE_CONFIG[s.type].color)
  );

  chartDatasets: ChartDataset<'doughnut'>[] = [
    { data: [], backgroundColor: [], borderWidth: 0 },
  ];

  readonly chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '65%',
    rotation: 180,
    plugins: { legend: { display: false } },
  };

  constructor() {
    effect(() => {
      this.chartDatasets = [{
        data:            this.data().map(s => s.count),
        backgroundColor: this.chartColors(),
        borderWidth:     0,
      }];
    });
  }

  get total(): number {
    return this.data().reduce((sum, s) => sum + s.count, 0);
  }

  /** Percentage of the current (filtered) set relative to the full portfolio. */
  get coveragePercent(): string {
    const grand = this.totalCount();
    if (!grand) return '0%';
    return Math.round((this.total / grand) * 100) + '%';
  }

  getPercentage(count: number): string {
    const t = this.total;
    return t ? Math.round((count / t) * 100) + '%' : '0%';
  }
}
