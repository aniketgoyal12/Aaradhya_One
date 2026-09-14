# Shubarmbh (शुभ आरंभ) — Frontend Governance Portal & E-Commerce Console

[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-8B1E22.svg?style=flat-square)](#)

> **Shubarmbh (शुभ आरंभ)** — *Pooja Essentials For a Divine Life*  
> A luxury Vedic devotional management portal providing an executive governance cockpit, multi-pillar catalog management, bundled package assembly, zonal Pujari dispatch coordination, live support chat monitoring, and financial escrow settlements.

---

## 🌟 Brand Identity & Visual Aesthetic

The Shubarmbh interface is tailored to reflect sacred temple luxury, regal tradition, and spiritual purity.

* **Official Emblem:** Circular emblem with the sacred temple Kalash, lotus petals, and diya illumination (`src/logo/Shubarmbh Pooja Essentials Logo(2).png`).
* **Royal Kumkum Maroon (`#8B1E22`):** Evokes sacred kumkum, temple banners, and devotion.
* **Temple Sacred Gold (`#D4AF37`):** Shimmering brass lamps, gold leaf, and festive divinity.
* **Velvet Obsidian (`#0a0406`):** Deep temple sanctum dark theme eliminating flat harsh black.
* **Sandalwood Ivory (`#FAF5EE`):** Warm, calming textual highlights and sacred accent badges.

### The 4 Brand Pillars
1. 🪔 **Pooja Items:** Premium brass diyas, kumkum, pure camphor, sandalwood tablets, incense sticks.
2. 🌿 **Ritual Essentials:** Gangajal, havan samagri, natural dhoop cones, raw cotton wicks.
3. 🎁 **Spiritual Gifts:** 24k gold-plated yantras, brass deity murtis, auspicious festival gift hampers.
4. 🏺 **Traditional Products:** Hand-hammered copper kalash, embroidered asans, brass pooja thalis.

---

## 🚀 Key Portal Modules

| Module | Route | Operational Capability |
| :--- | :--- | :--- |
| **Executive Dashboard** | `/` | Real-time platform KPI cockpit (GMV, orders, active pujaris, open tickets), brand pillar category filters, and quick-action shortcuts. |
| **Pooja Catalog** | `/products` | Complete inventory governance across all 4 pillars, stock level indicators, low-stock warnings, and modal CRUD dialogs. |
| **Package Bundler** | `/packages` | Visual ritual kit assembly, automated masked base price calculation, and bundled item quantity configurations. |
| **Order Governance** | `/orders` | Inspection of customer orders, itemized price deduction audits (Phase 2), and order fulfillment lifecycle tracking. |
| **Pujari Dispatch** | `/pujaris` | Zonal broadcast monitor, atomic acceptance tracking, direct booking management, and OTP ritual completion verification (Phase 3). |
| **Support Desk** | `/support` | Real-time customer inquiry queue, executive manual/auto assignment, and full chronological chat transcript viewer (Phase 4). |
| **Escrow Settlements** | `/settlements` | Financial escrow ledger, pending vs released payout tracking, and transaction verification (Phase 6). |

---

## 🛠️ Technology Stack

* **Core Framework:** React 18 (Hooks, Context API, Suspense)
* **Build System:** Vite 5.x
* **CSS & Design System:** Tailwind CSS v3.4 + Custom Divine Theme Tokens
* **Animations:** Framer Motion
* **Iconography:** Lucide React
* **Networking:** Axios with central JWT interceptor & error handling
* **Real-Time Layer:** Socket.io Client

---

## 💻 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* Running `pooja_backend` API server (default: `http://localhost:5000`)

### Installation & Setup

1. Navigate to the frontend directory:
   ```bash
   cd pooja_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The portal will be accessible at: `http://localhost:5173`

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 🔐 Default Admin Seed Credentials

To log in to the Shubarmbh Governance Portal:
* **Email:** `admin@aaradhya.com`
* **Password:** `AdminPass123`
* **Role:** `admin`

*(All requests automatically authenticate via JWT stored securely in browser storage and appended to outbound API calls).*

---

## 📂 Project Structure

```
pooja_frontend/
├── public/
├── src/
│   ├── api/
│   │   └── client.js             # Universal API request wrapper
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication & persistent user context
│   ├── logo/
│   │   └── Shubarmbh Pooja Essentials Logo(2).png # Official Brand Asset
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminSidebar.jsx  # Royal brand sidebar with active nav
│   │   │   ├── AdminHeader.jsx   # Top status bar & user profile
│   │   │   └── AdminLayout.jsx   # Root shell layout
│   │   ├── ui/
│   │   │   ├── Modal.jsx         # Accessible modal dialog
│   │   │   ├── StatCard.jsx      # Metrics card
│   │   │   └── Badge.jsx         # Sacred status indicators
│   │   └── catalog/
│   │       ├── ProductModal.jsx  # Inventory CRUD modal
│   │       └── PackageBuilder.jsx# Multi-item kit assembler
│   ├── pages/
│   │   ├── Login.jsx             # Branded admin sign-in
│   │   ├── Dashboard.jsx         # Executive overview cockpit
│   │   ├── Products.jsx          # Inventory table
│   │   ├── Packages.jsx          # Bundle showcase
│   │   ├── Orders.jsx            # Order & customization monitor
│   │   ├── PujariDispatch.jsx    # Zonal dispatch console
│   │   ├── SupportTickets.jsx    # Live chat & ticket manager
│   │   └── Settlements.jsx       # Financial escrow ledger
│   ├── App.jsx                   # Route provider & protected boundaries
│   ├── index.css                 # Custom scrollbars, glass utilities & fonts
│   └── main.jsx                  # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.js
```
