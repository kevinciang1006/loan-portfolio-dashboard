# Loan Portfolio Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue)](https://kevinciang1006.github.io/loan-portfolio-dashboard/)

A production-grade Angular 21 dashboard demonstrating Figma-to-Angular conversion, signals-based reactivity, Angular Material, and component-driven architecture.

## Live Demo

[https://kevinciang1006.github.io/loan-portfolio-dashboard/](https://kevinciang1006.github.io/loan-portfolio-dashboard/)

## Setup

```bash
npm install
ng serve
```

## Run Tests

```bash
npm test
```

## SummaryCardComponent API

| Input    | Type               | Required | Description                          |
|----------|--------------------|----------|--------------------------------------|
| `label`  | `string`           | Yes      | Card label text                      |
| `value`  | `string \| number` | Yes      | Primary display value                |
| `trend`  | `number`           | Yes      | Trend percentage (positive/negative) |
| `prefix` | `string`           | No       | Value prefix (e.g. `'$'`)            |
| `suffix` | `string`           | No       | Value suffix (e.g. `'%'`)            |

## Architecture

All reactive state lives in `DashboardComponent` as Angular Signals. A single `filteredLoans = computed(...)` drives the summary cards, table, and doughnut chart simultaneously — any keystroke in the search box updates all three in one pass, with no subscriptions or manual change detection.

```
DashboardComponent
├── searchQuery   = signal('')
├── localLoans    = signal<Loan[]>([...MOCK_LOANS])
├── filteredLoans = computed(...)   ← single source of truth
│   ├── SummaryCardComponent ×4    reads filteredLoans
│   ├── LoanTableComponent         reads filteredLoans
│   └── LoanChartComponent         reads filteredLoans
└── ConfirmDialogComponent         opened on delete
```

## Stack

- Angular 21 — standalone, zoneless, `ChangeDetectionStrategy.OnPush`
- Angular Material 21
- Tailwind CSS v4 + SCSS + CSS custom properties (light/dark theme)
- ng2-charts + Chart.js (doughnut chart)
- Jest + jest-preset-angular
- GitHub Actions → GitHub Pages
