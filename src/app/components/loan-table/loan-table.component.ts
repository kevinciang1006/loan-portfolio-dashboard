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
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Loan } from '../../mock/loans.mock';

@Component({
  selector: 'app-loan-table',
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule, CurrencyPipe],
  templateUrl: './loan-table.component.html',
  styleUrls: ['./loan-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanTableComponent implements AfterViewInit {
  loans = input.required<Loan[]>();
  deleteLoan = output<Loan>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
