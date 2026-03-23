import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  effect,
  input,
  output,
} from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Loan, LoanStatus, LOAN_STATUS_CONFIG } from '../../models/loan.model';

function customPaginatorIntl(): MatPaginatorIntl {
  const intl = new MatPaginatorIntl();
  intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const totalPages = Math.max(1, Math.ceil(length / pageSize));
    return `Page ${page + 1} of ${totalPages} (${length} results)`;
  };
  return intl;
}

@Component({
  selector: 'app-loan-table',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule, CurrencyPipe],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorIntl }],
  templateUrl: './loan-table.component.html',
  styleUrls: ['./loan-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanTableComponent implements AfterViewInit {
  loans = input.required<Loan[]>();
  deleteLoan = output<Loan>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Maps a backend status key to its display label. */
  statusLabel(status: LoanStatus): string {
    return LOAN_STATUS_CONFIG[status].label;
  }

  displayedColumns = ['id', 'borrower', 'amount', 'rate', 'status', 'date', 'actions'];
  dataSource = new MatTableDataSource<Loan>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.loans();
      this.paginator?.firstPage();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
