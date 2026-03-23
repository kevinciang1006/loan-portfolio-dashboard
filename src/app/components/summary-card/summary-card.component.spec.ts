import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SummaryCardComponent } from './summary-card.component';

describe('SummaryCardComponent', () => {
  let fixture: ComponentFixture<SummaryCardComponent>;

  function createComponent(inputs: {
    label: string;
    value: string | number;
    trend: number;
    prefix?: string;
    suffix?: string;
  }) {
    TestBed.configureTestingModule({
      imports: [SummaryCardComponent],
      providers: [provideZonelessChangeDetection(), provideAnimations()],
    });
    fixture = TestBed.createComponent(SummaryCardComponent);
    fixture.componentRef.setInput('icon', 'info');
    fixture.componentRef.setInput('label', inputs.label);
    fixture.componentRef.setInput('value', inputs.value);
    fixture.componentRef.setInput('trend', inputs.trend);
    if (inputs.prefix !== undefined) fixture.componentRef.setInput('prefix', inputs.prefix);
    if (inputs.suffix !== undefined) fixture.componentRef.setInput('suffix', inputs.suffix);
    fixture.detectChanges();
    return fixture;
  }

  it('should render the correct label and value', () => {
    createComponent({ label: 'Total Loans', value: 42, trend: 0 });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.label')?.textContent?.trim()).toBe('Total Loans');
    expect(el.querySelector('.value')?.textContent?.trim()).toBe('42');
  });

  it('should render prefix and suffix with value', () => {
    createComponent({ label: 'Avg Size', value: '250,000', trend: 0, prefix: '$', suffix: '' });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.value')?.textContent?.trim()).toBe('$250,000');
  });

  it('should apply positive class when trend > 0', () => {
    createComponent({ label: 'Active', value: 10, trend: 5 });
    const trend = fixture.nativeElement.querySelector('.trend') as HTMLElement;
    expect(trend.classList.contains('positive')).toBe(true);
    expect(trend.classList.contains('negative')).toBe(false);
  });

  it('should apply negative class when trend < 0', () => {
    createComponent({ label: 'Default', value: 4, trend: -2 });
    const trend = fixture.nativeElement.querySelector('.trend') as HTMLElement;
    expect(trend.classList.contains('negative')).toBe(true);
    expect(trend.classList.contains('positive')).toBe(false);
  });

  it('should render up arrow icon when trend is positive', () => {
    createComponent({ label: 'Active', value: 10, trend: 3 });
    const icon = fixture.nativeElement.querySelector('.trend-icon') as HTMLElement;
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('▲');
  });

  it('should render down arrow icon when trend is negative', () => {
    createComponent({ label: 'Default', value: 4, trend: -1 });
    const icon = fixture.nativeElement.querySelector('.trend-icon') as HTMLElement;
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('▼');
  });

  it('should not render trend icon when trend is zero', () => {
    createComponent({ label: 'Closed', value: 5, trend: 0 });
    const icon = fixture.nativeElement.querySelector('.trend-icon');
    expect(icon).toBeNull();
  });
});
