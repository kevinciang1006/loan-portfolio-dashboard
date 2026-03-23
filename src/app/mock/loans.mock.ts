export interface Loan {
  id: string;
  borrower: string;
  amount: number;
  rate: number;
  status: 'Active' | 'Closed' | 'Default' | 'Review';
  date: string;
  type: 'Residential' | 'Commercial' | 'Auto' | 'Personal';
}

// Distribution: 12 Active, 5 Closed, 4 Default, 4 Review
// Type: 10 Residential, 9 Commercial, 4 Auto, 2 Personal
export const MOCK_LOANS: Loan[] = [
  { id: 'LN-0041', borrower: 'Acme Corp',          amount: 450000,  rate: 5.25, status: 'Active',   date: '2024-03-15', type: 'Commercial'  },
  { id: 'LN-0042', borrower: 'Baker Family Trust',  amount: 285000,  rate: 4.75, status: 'Active',   date: '2024-01-22', type: 'Residential' },
  { id: 'LN-0043', borrower: 'Cascade Ventures',   amount: 1200000, rate: 6.10, status: 'Active',   date: '2023-11-08', type: 'Commercial'  },
  { id: 'LN-0044', borrower: 'Diana Patel',         amount: 95000,   rate: 7.50, status: 'Default',  date: '2022-06-30', type: 'Auto'        },
  { id: 'LN-0045', borrower: 'Evergreen Holdings',  amount: 780000,  rate: 5.80, status: 'Active',   date: '2024-02-10', type: 'Commercial'  },
  { id: 'LN-0046', borrower: 'Franklin & Sons',     amount: 320000,  rate: 4.90, status: 'Closed',   date: '2021-09-14', type: 'Residential' },
  { id: 'LN-0047', borrower: 'Grace Liu',           amount: 155000,  rate: 8.25, status: 'Review',   date: '2024-03-01', type: 'Personal'    },
  { id: 'LN-0048', borrower: 'Harbor Properties',   amount: 925000,  rate: 5.60, status: 'Active',   date: '2023-08-19', type: 'Commercial'  },
  { id: 'LN-0049', borrower: 'Ingram Realty',       amount: 410000,  rate: 4.80, status: 'Active',   date: '2023-12-05', type: 'Residential' },
  { id: 'LN-0050', borrower: 'Jackson Motors LLC',  amount: 72000,   rate: 9.00, status: 'Default',  date: '2022-03-17', type: 'Auto'        },
  { id: 'LN-0051', borrower: 'Kingston Capital',    amount: 1750000, rate: 5.40, status: 'Active',   date: '2024-01-30', type: 'Commercial'  },
  { id: 'LN-0052', borrower: 'Lena Kowalski',       amount: 198000,  rate: 6.75, status: 'Review',   date: '2024-02-28', type: 'Residential' },
  { id: 'LN-0053', borrower: 'Maple Grove Homes',   amount: 365000,  rate: 4.60, status: 'Active',   date: '2023-05-11', type: 'Residential' },
  { id: 'LN-0054', borrower: 'Northgate Partners',  amount: 680000,  rate: 5.95, status: 'Closed',   date: '2020-11-20', type: 'Commercial'  },
  { id: 'LN-0055', borrower: 'Olivia Santos',       amount: 50000,   rate: 11.50, status: 'Default', date: '2022-08-04', type: 'Personal'    },
  { id: 'LN-0056', borrower: 'Pinnacle Real Estate',amount: 540000,  rate: 5.15, status: 'Active',   date: '2024-03-20', type: 'Residential' },
  { id: 'LN-0057', borrower: 'Quinn Industries',    amount: 890000,  rate: 6.30, status: 'Active',   date: '2023-09-27', type: 'Commercial'  },
  { id: 'LN-0058', borrower: 'Riverside Auto Group',amount: 88000,   rate: 8.75, status: 'Closed',   date: '2021-04-13', type: 'Auto'        },
  { id: 'LN-0059', borrower: 'Summit Development',  amount: 1100000, rate: 5.70, status: 'Active',   date: '2023-07-02', type: 'Commercial'  },
  { id: 'LN-0060', borrower: 'Tara Nkosi',          amount: 245000,  rate: 5.00, status: 'Active',   date: '2024-02-15', type: 'Residential' },
  { id: 'LN-0061', borrower: 'Urbane Interiors',    amount: 330000,  rate: 6.50, status: 'Review',   date: '2024-03-10', type: 'Commercial'  },
  { id: 'LN-0062', borrower: 'Vallejo Family Home', amount: 175000,  rate: 3.75, status: 'Closed',   date: '2019-06-25', type: 'Residential' },
  { id: 'LN-0063', borrower: 'Westwood Builders',   amount: 620000,  rate: 5.35, status: 'Active',   date: '2023-10-14', type: 'Residential' },
  { id: 'LN-0064', borrower: 'Xander Fleet Co.',    amount: 115000,  rate: 9.50, status: 'Default',  date: '2023-01-08', type: 'Auto'        },
  { id: 'LN-0065', borrower: 'Yuen & Associates',   amount: 460000,  rate: 5.55, status: 'Review',   date: '2024-03-18', type: 'Residential' },
];
