import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartDataset, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-loan-chart',
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './loan-chart.component.html',
  styleUrls: ['./loan-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanChartComponent {
  data       = input.required<number[]>();
  totalCount = input.required<number>();

  readonly chartLabels = ['Residential', 'Commercial', 'Auto', 'Personal'];
  readonly chartColors = ['#639922', '#3789dd', '#ef9e29', '#d3547e'];

  chartDatasets: ChartDataset<'doughnut'>[] = [
    { data: [], backgroundColor: this.chartColors, borderWidth: 0 },
  ];

  readonly chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '65%',
    rotation: 180,
    plugins: { legend: { display: false } },
  };

  constructor() {
    effect(() => {
      this.chartDatasets = [
        { data: [...this.data()], backgroundColor: this.chartColors, borderWidth: 0 },
      ];
    });
  }

  get total(): number {
    return this.data().reduce((a, b) => a + b, 0);
  }

  /** Percentage of the current (filtered) set relative to the full portfolio. */
  get coveragePercent(): string {
    const grand = this.totalCount();
    if (!grand) return '0%';
    return Math.round((this.total / grand) * 100) + '%';
  }

  getPercentage(value: number): string {
    const t = this.total;
    return t ? ((value / t) * 100).toFixed(0) + '%' : '0%';
  }
}
