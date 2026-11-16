# 🌸 Luu (Pelu) — Product Specification (SPEC.md)

## 1. Product Overview & Vision
**Luu** (internally `pelu-crm`) is a multi-tenant SaaS management platform and CRM engineered for hair salons, nail studios, barbershops, and beauty spas. 

### Core Value Proposition
- **Salon Owners/Admins:** Streamlines front-desk operations, eliminates appointment overlaps, automates inventory tracking, and computes stylist commissions with minimal friction.
- **Stylists / Professionals:** Gives mobile-accessible stations, schedule visibility, client history, technical formulas (colorimetry/nail art), and confidential recipe protection.
- **Clients:** Frictionless mobile-first self-booking link (via Instagram / WhatsApp), automatic booking confirmation, service history, and post-service satisfaction surveys.

---

## 2. Actors & Role-Based Permissions (RBAC)

| Role | Scope | Permissions & Access Limits |
| :--- | :--- | :--- |
| `admin` (Owner/Manager) | Tenant-wide (`salonId`) | Full control over salon settings, stylists, stations, services, financial reports, inventory restocking, and checkout. |
| `stylist` (Professional) | Assigned station / personal client book | View assigned appointments, manage station status (`ready`, `occupied`, `sanitizing`), view/edit technical client cards & formulas, track personal commission stats. Cannot access overall salon financial totals or global settings. |
| `client` | Self only | Book appointments via public link, view personal upcoming/past bookings, fill satisfaction surveys. Zero access to internal salon stations or notes. |

---

## 3. Core Feature Modules & Business Rules

### 3.1 Salon Floor & Station Management
- **Station Categories:** `hair_color`, `hair_cut`, `wash_spa`, `nails`, `lashes`, `general`.
- **Station Lifecycle:**
  $$\text{ready} \longrightarrow \text{occupied} \longrightarrow \text{sanitizing} \longrightarrow \text{ready}$$
- **Chair Turn Times:** Tracks `timeRemainingMinutes` for in-service clients.
- **Stylist Assignment:** Stations can be assigned dynamically or permanently to a professional.

### 3.2 Multi-Service Agenda & Walk-in Check-in
- **Combined Bookings:** Supports booking multiple services across different stylists in one visit (e.g. Balayage with María + Manicure with Laura).
- **Walk-in Check-in:** Front desk marks client arrival, instantly alerting the stylist and placing the client into the digital waiting queue.
- **Conflict Prevention:** A stylist cannot have concurrent overlapping appointments unless explicitly configured for parallel processing (e.g., waiting under a hair processor during color exposure).

### 3.3 Technical Cards & Confidential Formulations
- **Colorimetry Cards:** Exact measurement records (grams of base, shade codes, developer volume, exposure time).
- **Nail Art & Aesthetics:** Gel/polish shade code, rubber base type, design specs.
- **Formula Privacy Flag:** Stylists can mark exclusive proprietary formulas as confidential so other professionals cannot inspect them.
- **Photo Records:** Before/after gallery attached to the client history.

### 3.4 Point of Sale (POS), Checkout & Commissions
- **Single-flow Settlement:** Aggregates rendered services, add-on products (retail), applicable discounts, and tip.
- **Automated Inventory Depletion:** Finalizing a technical service automatically deducts measured supplies (e.g. 60g dye, 90ml developer).
- **Stylist Commission Engine:** Configurable percentage per professional calculated at transaction close.
- **Post-Service Feedback Trigger:** On checkout close, generates an automated WhatsApp survey prompt. Low ratings (< 3 stars) trigger a manager rectification alert.

### 3.5 Automated Loyalty & Retention Engine
- **Lifecycle Cadence Triggers:**
  - Gel/Permanent Nails: 14 days
  - Root Touch-up: 25 days
  - Haircut & Styling: 45 days
- **Churn Recovery:** Identifies clients inactive for >45 days and drafts personalized retention offers.
- **Birthday Automation:** Automated discount token generator for client birth months.

### 3.6 Multi-Tenant Routing
- Every salon has a unique `slug` (e.g., `luu.app/:salonSlug`).
- The public booking portal resolves the `salonId` from the slug and displays only that salon's branding, services, and available professionals.
