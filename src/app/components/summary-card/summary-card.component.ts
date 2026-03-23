import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const numberFormat = new Intl.NumberFormat('en-US');

@Component({
  selector: 'app-summary-card',
  imports: [MatIconModule],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  icon  = input<string>('');
  label = input.required<string>();
  value = input.required<string | number>();
  trend = input.required<number>();
  prefix = input<string>('');
  suffix = input<string>('');

  /**
   * Numbers are formatted with locale-aware thousand separators (e.g. 1247 → 1,247).
   * Strings are passed through unchanged (pre-formatted values like '$284.4k').
   */
  readonly displayValue = computed(() => {
    const v = this.value();
    return typeof v === 'number' ? numberFormat.format(v) : v;
  });
}
