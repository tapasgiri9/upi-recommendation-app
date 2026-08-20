# UPI Recommendation Assistant

A lightweight, personal-use Android application and web client that recommends which UPI payment app to use based on transaction amount, RuPay acceptance, and balanced usage history.

> **Privacy Guarantee**: 100% Offline, no external network requests, zero telemetry, and no payment credentials requested or handled.

---

## 1. Purpose

When paying via UPI in India, users frequently juggle multiple UPI apps (Navi, super.money, Paytm, BHIM), micro-payment features (BHIM UPI Lite), and RuPay Credit Card UPI apps (Kiwi).

This assistant acts as a smart payment router:
1. Accepts the payment amount.
2. For transactions of ₹100 or more, asks whether the merchant accepts RuPay on UPI.
3. Determines the recommended payment app following deterministic thresholds and a balanced usage engine.
4. Assumes the recommendation was used and records it into local device storage.
5. Uses the complete offline history to balance future recommendations.
6. Provides an interactive dashboard showing payment distributions and statistics.

---

## 2. Features

- **Micro-payment routing**: Instant auto-recommendation of **BHIM UPI Lite** for transactions $\le \text{₹}50$.
- **RuPay credit router**: Recommends **Kiwi** for transactions $\ge \text{₹}100$ when RuPay on UPI is accepted.
- **Weighted balanced engine**: Dynamically balances usage across **Navi**, **super.money**, **Paytm**, and **BHIM** using inverse-usage weight balancing.
- **Paise-precision calculation**: Avoids JavaScript floating-point errors by converting all amounts directly to integer paise ($₹50 = 5000\text{ paise}$).
- **Historical Dashboard**: Real-time filters for Today, 7 Days, 30 Days, and All-Time with KPI cards and horizontal distribution bars.
- **Local Persistence**: Instant offline storage via `AsyncStorage` / `localStorage` with export and clear capabilities.

---

## 3. Tech Stack

- **Framework**: React / React Native / Expo compatible
- **Language**: Strict TypeScript (`"strict": true`, no `any`)
- **Styling**: Tailwind CSS & Mobile-Optimized responsive UI
- **Animations & Icons**: `motion/react` and `lucide-react`
- **Build System**: Vite & EAS Build (Android APK)

---

## 4. Project Structure

```text
upi-recommendation-assistant/
├── app.json                  # Expo / Android app identity config
├── eas.json                  # EAS Build profiles (preview APK)
├── metadata.json             # App metadata
├── package.json              # Project dependencies & scripts
├── README.md                 # Complete documentation
│
├── src/
│   ├── App.tsx               # Main application layout & navigation
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Tailwind CSS entry point
│   │
│   ├── config/
│   │   └── paymentApps.json  # Payment apps metadata source of truth
│   │
│   ├── constants/
│   │   └── paymentRules.ts   # Rule constants, thresholds & reasons
│   │
│   ├── types/
│   │   ├── paymentApp.ts     # Payment app types & interfaces
│   │   ├── paymentRecord.ts  # Payment record & dashboard types
│   │   └── recommendation.ts # Strategy & result interfaces
│   │
│   ├── utils/
│   │   ├── amountUtils.ts    # Paise parser, validator & formatter
│   │   └── dateUtils.ts      # Timestamp filters & relative formatters
│   │
│   ├── storage/
│   │   └── storageKeys.ts    # Storage key constants
│   │
│   ├── services/
│   │   ├── usageStorageService.ts   # Safe offline storage service
│   │   ├── recommendationService.ts # Recommendation engine & strategy
│   │   └── dashboardService.ts      # On-the-fly metric aggregations
│   │
│   ├── components/
│   │   ├── AmountInput.tsx          # Numerical amount input with quick chips
│   │   ├── RupaySelector.tsx        # Conditional RuPay toggle
│   │   ├── RecommendationCard.tsx   # Recommended app card & explanation
│   │   ├── AppIcon.tsx              # Authentic brand vector icons
│   │   ├── UsageSummary.tsx         # Horizontal distribution bars & stats
│   │   ├── Header.tsx               # App header bar
│   │   └── BottomNav.tsx            # Bottom tab navigation
│   │
│   ├── screens/
│   │   ├── PayScreen.tsx            # Primary recommendation screen
│   │   ├── DashboardScreen.tsx      # Metrics, distribution & history
│   │   └── SettingsScreen.tsx       # Version, rules & data management
│   │
│   └── tests/
│       ├── amountUtils.test.ts      # Paise & currency unit tests
│       └── recommendationService.test.ts # Boundary & probability tests
```

---

## 5. Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Run Web Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 6. Testing

Run the test suite:
```bash
npm run lint
```
The test modules verify:
- ₹50 boundary $\rightarrow$ BHIM UPI Lite
- ₹50.01 – ₹99.99 $\rightarrow$ Balanced engine
- ₹100+ + RuPay YES $\rightarrow$ Kiwi
- ₹100+ + RuPay NO $\rightarrow$ Balanced engine
- Weighted random distribution favoring lower-used apps

---

## 7. Android EAS Build (APK for Phone Installation)

To build a standalone installable APK on your machine:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo / EAS**:
   ```bash
   eas login
   ```

3. **Build Android APK (Preview Profile)**:
   ```bash
   eas build --platform android --profile preview
   ```

4. **Download and Install**:
   EAS will generate a direct download link for the `.apk` file. Download and install it on your Android phone.

---

## 8. Recommendation Rules

| Transaction Amount | RuPay Accepted | Recommendation | Reason |
|---|---|---|---|
| **$\le \text{₹}50$** (inclusive) | *Not asked* | **BHIM UPI Lite** | `Amount is ₹50 or below.` |
| **$\text{₹}50.01$ – $\text{₹}99.99$** | *Not asked* | **Balanced Engine** | `Recommended based on your app usage.` |
| **$\ge \text{₹}100$** | **YES** | **Kiwi** | `RuPay is accepted and the amount is ₹100 or more.` |
| **$\ge \text{₹}100$** | **NO** | **Balanced Engine** | `Recommended based on your app usage.` |

---

## 9. Recommendation Algorithm

For apps eligible for the balanced engine (**Navi**, **super.money**, **Paytm**, **BHIM**):

$$\text{weight}_i = \frac{1}{\text{usageCount}_i + 1}$$

$$\text{probability}_i = \frac{\text{weight}_i}{\sum \text{weights}}$$

- **Zero-usage apps** receive maximum probability ($\text{weight} = 1.0$).
- **High-usage apps** receive lower weight, naturally balancing total usage over time.
- Uses the **complete local history** to prevent recency bias.

---

## 10. Local Storage

- Stored key: `payment_history`
- Schema:
  ```ts
  interface PaymentRecord {
    id: string;
    appId: 'kiwi' | 'navi' | 'super_money' | 'paytm' | 'bhim' | 'bhim_lite';
    amountPaise: number;
    timestamp: number;
    recommendationType: 'bhim_lite' | 'kiwi' | 'balanced';
    rupayAccepted?: boolean;
  }
  ```

---

## 11. Adding / Changing Payment Apps

Payment app metadata is decoupled into `src/config/paymentApps.json`. To adjust app details, add or edit the JSON entries without modifying UI components.

---

## 12. Out of Scope (V1)

- No UPI PIN / bank account handling.
- No QR code scanner.
- No external server or cloud database.
- No Play Store billing.
- 100% offline client-side architecture.
