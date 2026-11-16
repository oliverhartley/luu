# 🎨 Design System & UI Specifications (DESIGN_SYSTEM.md)

## 1. Design Principles
- **Aesthetic & Polished:** Salons and beauty spas demand modern, clean typography and warm, refined palettes.
- **Mobile-First for Daily Operations:** Stylists access stations and recipes on smartphones/tablets behind chairs.
- **Immediate Feedback:** Clear visual states for pending actions, optimistic UI updates, and non-blocking toast notifications.

---

## 2. Color Palette & Typography

- **Font Family:** Modern Sans-Serif (`Inter` or system sans default).
- **Core Neutral Palette:**
  - Backgrounds: `bg-slate-50` / `bg-white` (Dark mode: `bg-slate-900`)
  - Borders: `border-slate-200` / `border-slate-100`
  - Text: `text-slate-900` (headings), `text-slate-600` (body), `text-slate-400` (muted)
- **Brand Accents:**
  - Rose/Fuchsia tones for beauty/salon identity (e.g. `rose-500`, `rose-600`).
  - Emerald/Green for active/ready states (`emerald-500`).
  - Amber for warning or sanitizing chair states (`amber-500`).

---

## 3. UI Component Primitives Catalog (`src/components/ui/`)

| Component | File Path | Usage & Variants |
| :--- | :--- | :--- |
| **Button** | [button.tsx](file:///Users/oliverhartley/Documents/Antigravity/Pelu/src/components/ui/button.tsx) | `default`, `outline`, `ghost`, `secondary`, `destructive`. Supports `size="sm"`, `size="lg"`. |
| **Badge** | [badge.tsx](file:///Users/oliverhartley/Documents/Antigravity/Pelu/src/components/ui/badge.tsx) | `default`, `secondary`, `destructive`, `outline`, `success`, `warning`. Used for chair statuses & tags. |
| **Card** | [card.tsx](file:///Users/oliverhartley/Documents/Antigravity/Pelu/src/components/ui/card.tsx) | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. |
| **Input** | [input.tsx](file:///Users/oliverhartley/Documents/Antigravity/Pelu/src/components/ui/input.tsx) | Accessible form text inputs with focus rings (`ring-rose-500`). |
| **Avatar** | [avatar.tsx](file:///Users/oliverhartley/Documents/Antigravity/Pelu/src/components/ui/avatar.tsx) | Client and stylist image display with fallback initials. |
| **Toast** | [ToastContainer.tsx](file:///Users/oliverhartley/Documents/Antigravity/Pelu/src/components/ui/ToastContainer.tsx) | Floating notifications for checkout, confirmations, and errors. |

---

## 4. UI Patterns & Best Practices

1. **Station Status Badges:**
   - Ready $\rightarrow$ `badge variant="success"` (Green)
   - Occupied $\rightarrow$ `badge variant="default"` (Blue / Rose)
   - Sanitizing $\rightarrow$ `badge variant="warning"` (Amber)
2. **Form Layouts:**
   - Always group related fields inside `Card` containers.
   - Every input should have explicit labels and placeholder copy.
3. **Responsive Breakpoints:**
   - `< 768px (Mobile):` Single-column cards, sticky bottom CTA bars for client booking and stylist check-in.
   - `≥ 1024px (Desktop):` Multi-column grid for the salon floor overview and calendar matrix.
