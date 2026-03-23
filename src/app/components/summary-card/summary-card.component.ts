import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
}
