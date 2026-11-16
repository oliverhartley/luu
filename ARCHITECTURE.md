# 🏛️ Architecture & System Design (ARCHITECTURE.md)

## 1. Architectural Philosophy & Well-Architected Pillars
Luu is built on a **Serverless, Edge-First, Multi-Tenant** architecture aligned with the **Google Cloud Architecture Framework**:
- **System Design:** Single-Page Application (SPA / PWA) decoupled from managed serverless backend services.
- **Operational Excellence:** Immutable builds, automated linting, multi-environment deployments (`test`, `prod`), and codified configurations.
- **Security & Privacy:** Multi-tenant data isolation, least-privilege Firestore rules, and token-based RBAC.
- **Reliability:** Regional multi-zone resilience through managed Cloud Firestore and Firebase Hosting.
- **Cost & Performance Optimization:** Targeted for **$0/month** on Google Cloud Free Tier quotas via aggressive edge caching and minimal document queries.

---

## 2. Technology Stack

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | Component-based, strict typing, high ecosystem maturity |
| **Build Tool & Bundler** | Vite 5 | Instant HMR, tree-shaking, production bundle optimization |
| **Styling & Design System** | Tailwind CSS + CVA + Lucide Icons | Utility-first, zero runtime CSS overhead, accessible icons |
| **Database & Auth** | Cloud Firestore + Firebase Authentication | Multi-region NoSQL, real-time sync, zero maintenance |
| **Backend & Jobs** | Cloud Functions for Firebase (Node.js) | Serverless event triggers, background webhooks, and cleanup |
| **Static Hosting & CDN** | Firebase Hosting (Global Edge) | High-speed global edge distribution with automatic SSL |

---

## 3. Directory Layout & Layer Boundaries

```
src/
├── components/          # Presentation layer
│   ├── ui/              # Reusable atomic primitives (buttons, inputs, cards)
│   ├── salon-floor/     # Station visualizer & chairs
│   ├── agenda/          # Calendar and scheduling views
│   ├── client-portal/   # Public-facing booking experience
│   ├── checkout/        # Point of Sale & receipt settlement
│   ├── inventory/       # Stock and supply tracking
│   └── ...
├── context/             # Global React state (AuthContext, SalonContext)
├── hooks/               # Custom hooks encapsulated for data-fetching and business logic
├── lib/                 # Third-party wrappers (Firebase SDK client instance)
├── types/               # TypeScript interfaces & domain entities
└── utils/               # Pure helper functions (formatting, date calculations)
```

### Architectural Guardrails
1. **No direct database calls inside presentation components:** Components must use custom hooks (`src/hooks/`) or context providers (`src/context/`) to interact with Firestore.
2. **Tenant ID enforcement:** All Firestore read/write operations must explicitly validate or scope the active `salonId`.
3. **No heavy runtime styling packages:** Avoid styled-components or emotion; use Tailwind CSS utility classes with `cn(...)` (`clsx` + `tailwind-merge`).

---

## 4. Multi-Tenancy Architecture

Data is logically partitioned by salon:
```
Root Level:
  /salons/{salonId}                  # Tenant metadata (slug, branding, config)
    ├── /stations/{stationId}        # Physical chairs/stations
    ├── /services/{serviceId}        # Catalog of salon offerings
    ├── /stylists/{stylistId}        # Staff directory & commission rates
    ├── /clients/{clientId}          # Client records & CRM
    │     └── /technical_cards/      # Formulas and service logs
    ├── /appointments/{apptId}       # Scheduled bookings
    └── /inventory/{itemId}          # Products and technical supplies
```

*Stylists and clients reference `salonId` to guarantee that query results never bleed into adjacent tenant spaces.*
