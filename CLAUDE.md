# CLAUDE.md — Loan Portfolio Dashboard

## Angular 21 Rules
- No `standalone: true` in decorators — it's the default
- Use `input()` / `output()` functions, NOT `@Input()` / `@Output()` decorators
- Use `inject()` NOT constructor injection
- `ChangeDetectionStrategy.OnPush` on every component — no exceptions
- Use `@if` / `@for` / `@switch` — NOT `*ngIf` / `*ngFor` / `*ngSwitch`
- Use `class` bindings NOT `ngClass`
- Use `style` bindings NOT `ngStyle`
- No `any` types — use `unknown` if type is uncertain
- Use `signal()`, `computed()`, `effect()` for all reactive state
- Use `inject()` for dependency injection inside `constructor()` or field initializers

## Tailwind CSS Rules — CRITICAL
Tailwind is the primary styling tool. Follow these rules strictly:

✅ CORRECT — style in the template using utility classes:
```html
<div class="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
  <span class="text-sm font-medium text-slate-500">Total Loans</span>
  <span class="text-3xl font-bold text-slate-900">1,247</span>
</div>
```

❌ WRONG — creating custom CSS classes in SCSS files:
```scss
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}
```

❌ WRONG — using arbitrary values when a Tailwind class exists:
```html
<div style="padding: 24px">
```

## When SCSS is allowed
SCSS files should only contain:
1. CSS custom properties on `:root` and `body.dark` for theming
2. Angular Material token overrides (e.g. `--mat-table-background-color`)
3. Status chip color classes (`.chip--active`, `.chip--default`, etc.)
   because these are dynamic and Tailwind can't purge dynamic class names
4. `:host` display rules if needed

Every other style must be a Tailwind utility class in the template.

## Theming
- Light/dark via CSS custom properties on `body.dark` class
- Use Tailwind's arbitrary value syntax to reference CSS vars when needed:
  `class="bg-[var(--color-surface)] text-[var(--color-text)]"`
- OR define Tailwind theme extensions in tailwind.config.js to map 
  CSS vars to Tailwind tokens:
```js
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        border: 'var(--color-border)',
        'text-base': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        primary: 'var(--color-primary)',
      }
    }
  }
```
  Then use: `class="bg-surface text-text-base border-border"`

## File Structure
- Components: `src/app/components/`
- Pages: `src/app/pages/`
- Mock data: `src/app/mock/`
- Models/interfaces: `src/app/models/`

## Component SCSS files
Should be near-empty for most components. If a component SCSS file 
has more than 10 lines (excluding theming/chip exceptions), 
that is a red flag — move those styles to Tailwind classes in the template.
