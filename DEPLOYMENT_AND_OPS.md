# 🚀 Deployment, Operations & Zero-Cost Guardrails (DEPLOYMENT_AND_OPS.md)

## 1. Zero-Cost Budget Architecture
All production infrastructure is engineered to run permanently within Google Cloud & GitHub Free Tiers:
- **Firebase Hosting:** Free up to 10 GB storage and 360 MB/day data transfer.
- **Cloud Firestore:** Free up to 50,000 reads, 20,000 writes, 20,000 deletes daily, and 1 GiB total storage.
- **Cloud Functions:** Free up to 2 million invocations/month.
- **GitHub Actions:** Free up to 2,000 CI/CD runner minutes/month.

---

## 2. Environments & Targets

| Target | Firebase Target | Command | Purpose |
| :--- | :--- | :--- | :--- |
| **Development** | Local emulator / dev | `npm run dev` | Local development at `http://localhost:3000` |
| **Test / Staging** | `test` | `npm run deploy:test` | Verification environment before shipping |
| **Production** | `prod` | `npm run deploy:prod` | Customer-facing live application |

---

## 3. High-Performance Edge Caching Policy
To eliminate unnecessary hosting egress and speed up user page loads:
- **Hashed Assets (`/assets/**`):** Vite generates content-hashed filenames for all compiled JS, CSS, and media. These are cached at the edge and browser for **1 year** (`max-age=31536000, immutable`).
- **Entrypoints (`index.html`):** Must **never** be cached (`no-cache, no-store, must-revalidate`) to guarantee immediate delivery of updates when a new release deploys.

---

## 4. Automated CI/CD Pipeline (GitHub Actions)
Deployments should be triggered automatically on push:
- **`pull_request`:** Runs `npm run build` and deploys to a temporary Firebase Preview Channel.
- **`push` to `main`:** Runs unit/type checks and automatically deploys to the `prod` hosting target.

---

## 5. Cost & Health Guardrails
1. **GCP Budget Alert:** Codified hard alert threshold at **$1.00 USD/month** with notifications sent to administrators.
2. **Infinite Loop Protection:** Firestore real-time snapshot listeners (`onSnapshot`) must always unmount properly in React `useEffect` cleanups to prevent run-away billable reads.
3. **No Unindexed Broad Queries:** Never perform client-side filtering on large collections; enforce indexed queries scoped to `salonId`.
