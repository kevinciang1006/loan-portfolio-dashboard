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

## Angular Material Theming — CRITICAL
Docs: https://material.angular.dev/guide/theming-your-components

### Angular Material v19+ API — `mat.theme()` + `color-scheme`
This project uses Angular Material 21 (v19+ API). The correct approach is:

```scss
@use '@angular/material' as mat;

// mat.theme() emits --mat-sys-* CSS variables using light-dark() function.
// One call handles both modes — no all-component-themes() needed.
html {
  color-scheme: light;   // default light mode
  @include mat.theme((
    color:      (primary: mat.$azure-palette),
    typography: (plain-family: 'Inter', brand-family: 'Inter'),
    density:    0,
  ));
}

// Flips all light-dark() values to dark — CSS-native, no SCSS re-emit needed.
body.dark {
  color-scheme: dark;
}

// Per-component tweaks go in :root — they override the system token defaults.
:root {
  @include mat.slide-toggle-overrides((
    track-height: 24px,
    selected-track-color: #9facc1,
  ));
}
```

❌ WRONG — old pre-v19 API (no automatic dark mode):
```scss
$light-theme: mat.define-theme(...);
$dark-theme:  mat.define-theme(...);
:root      { @include mat.all-component-themes($light-theme); }
body.dark  { @include mat.all-component-colors($dark-theme); }
```

❌ WRONG — prebuilt theme (static, no dark mode):
```json
"styles": ["node_modules/@angular/material/prebuilt-themes/azure-blue.css"]
```

❌ WRONG — raw CSS custom properties:
```scss
.mat-mdc-slide-toggle { --mdc-switch-track-height: 16px; }
```

- `styles.scss` must have `@use '@angular/material' as mat;` at the top
- `mat.theme()` goes on `html`, NOT `:root`
- Dark mode: `body.dark { color-scheme: dark; }` — that's it, no other SCSS needed
- Per-component overrides go in `:root` via `mat.*-overrides()`
- Button color variants: scope `mat.button-overrides()` to a CSS class (see section below)
- CSS selectors (e.g. `display: none` on a child icon) are the only acceptable exception

### M3 Button Variants (replaces the deprecated `color` input)
In Angular Material M3, `color="warn"` / `color="primary"` are M2-only and have no effect.
The M3 pattern is to scope `mat.button-overrides()` to a CSS class — same idea as shadcn variants:

✅ CORRECT — variant class in styles.scss + structural attribute in template:
```scss
// styles.scss
.btn-danger {
  @include mat.button-overrides((
    // filled variant (mat-flat-button)
    filled-container-color:    #dc2626,
    filled-label-text-color:   #ffffff,
    filled-state-layer-color:  #ffffff,   // hover/focus ripple layer
    filled-ripple-color:       #ffffff,
    // outlined variant (mat-stroked-button)
    outlined-outline-color:    #dc2626,
    outlined-label-text-color: #dc2626,
    outlined-state-layer-color: #dc2626,
    outlined-ripple-color:     #dc2626,
  ));
}
```
```html
<!-- structural attribute picks the shape, class picks the color -->
<button mat-flat-button    class="btn-danger">Delete</button>  <!-- filled red  -->
<button mat-stroked-button class="btn-danger">Delete</button>  <!-- outlined red -->
```

❌ WRONG — M2-style color input (no-op in M3):
```html
<button mat-flat-button color="warn">Delete</button>
```

## CSS Custom Property Chaining — CRITICAL Dark Mode Gotcha

When `mat.*-overrides()` is called on `:root`, `var(--color-*)` references are
resolved **at the html element** (where `--color-surface: #ffffff`). That resolved
value is what children inherit — NOT the raw `var()` reference.

**Result:** `body.dark { --color-surface: #1e293b }` has no effect on inherited
Angular Material tokens because the chain locks in at `:root`.

✅ FIX — also call the color overrides inside `body.dark`:
```scss
// :root block sets light values (and fixed dimensions/shapes):
:root {
  @include mat.table-overrides((background-color: var(--color-surface), ...));
}

// body.dark block re-declares color tokens — var() now resolves to dark values:
body.dark {
  @include mat.table-overrides((background-color: var(--color-surface), ...));
  @include mat.paginator-overrides((container-background-color: var(--color-surface), ...));
  @include mat.dialog-overrides((container-color: var(--color-surface), ...));
  @include mat.form-field-overrides((filled-container-color: var(--color-surface-alt), ...));
}
```

Dimension/shape tokens (heights, radii) only need to be in `:root` — they're
mode-independent. Only color tokens need the `body.dark` repetition.

## When SCSS is allowed
SCSS files should only contain:
1. CSS custom properties on `:root` and `body.dark` for theming
2. Angular Material token overrides via `mat.component-overrides()` mixins
   (color tokens must appear in BOTH `:root` and `body.dark` — see gotcha above)
3. Status chip color classes (`.chip--active`, `.chip--default`, etc.)
   because these are dynamic and Tailwind can't purge dynamic class names
4. `:host` display rules if needed
5. CSS selector rules that cannot be expressed as tokens (e.g. `display: none` on a child element)

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
