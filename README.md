# QRTag Frontend Platform

> An end-to-end smart QR code asset tagging, tracking, lost & found recovery, and digital memorial platform.

---

## 📌 Project Overview

**QRTag** is an intelligent asset management ecosystem that connects physical items to digital identities using secure QR codes. Item owners register and attach QR tags to their valuables. If an item is misplaced, the owner marks it as lost; anyone scanning the QR tag is directed to a secure finder portal where they can view designated return instructions and initiate real-time, privacy-preserving communication with the owner.

The platform also provides an integrated e-commerce store for purchasing tags and accessories, digital memorial profiles with interactive tributes, and a comprehensive administrative portal.

---

## 🏗️ Architecture & Applications

The repository is organized as a clean multi-app frontend codebase comprising three main applications:

```text
qrtag-frontend/
├── qrtag-admin/       # Admin control panel & back-office dashboard
├── qrtag-web-app/     # Customer portal, asset management & finder interface
├── qrtag-website/     # Public product showcase & marketing landing site
├── .gitignore         # Monorepo gitignore rules
└── README.md          # Project documentation
```

### 1. QRTag Website (`/qrtag-website`)
* **Role**: Public marketing, landing page, and customer acquisition site.
* **Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, React-Bootstrap, Google reCAPTCHA.
* **Key Features**:
  * Hero product showcase and interactive feature walkthroughs.
  * Step-by-step "How It Works" asset recovery guide.
  * Tag purchase packages, pricing, and FAQ section.
  * Contact and inquiry forms secured with Google reCAPTCHA.
  * Digital memorial tags showcase and company vision pages.
  * Live Site: [https://qrtag.it](https://qrtag.it)

### 2. QRTag Web App (`/qrtag-web-app`)
* **Role**: Core customer application for item owners and item finders.
* **Tech Stack**: React 18, React Router v6, Material-UI (MUI 5), AWS Amplify (Cognito), Firebase, Stripe, PubNub, Mixpanel.
* **Key Features**:
  * **My Stuff**: Asset inventory to add, edit, and categorize valuables with custom photos and metadata.
  * **Lost & Found Workflow**: Instantly toggle items between "Active" and "Lost" states with automated scan geolocation alerts.
  * **Finder Interface (`/uuid/:uid`)**: Safe, responsive landing page for finders scanning a physical tag without exposing owner personal contact details.
  * **Real-Time Chat**: Direct, secure in-app messaging between finder and owner powered by PubNub.
  * **Store & Checkout**: In-app e-commerce store for tags and accessories with Stripe payment processing.
  * **Digital Memorials**: Interactive tribute pages for memorializing loved ones or cherished memories.
  * Live App: [https://app.qrtag.it](https://app.qrtag.it)

### 3. QRTag Admin (`/qrtag-admin`)
* **Role**: Comprehensive administration and operational dashboard.
* **Tech Stack**: React 17, React-App-Rewired, Redux Thunk, Reactstrap / Bootstrap 4, Firebase Firestore & Auth, ApexCharts, Leaflet.
* **Key Features**:
  * **User Management**: Role-based access control, account approvals, and user directory.
  * **QR Code Management**: Batch generation, activation tracking, and QR code inventory monitoring.
  * **Subscription Management**: Plan configurations, billing status, and member subscriptions.
  * **Honorary & Flyer Accounts**: Specialized enterprise and promotional account administration.
  * **Feedback & Surveys**: Collection and review of customer surveys and app feedback.
  * **Digital Memorial Administration**: Review and moderation of memorial profiles.
  * **Platform Settings**: Dynamic app messaging and system-wide configuration.

---

## 🛠️ Technology Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frameworks & Libraries** | Next.js 15, React 19, React 18, React 17, TypeScript, JavaScript (ES6+) |
| **UI & Styling** | Material-UI (MUI 5), Bootstrap 5 / React-Bootstrap, Reactstrap, Sass / SCSS |
| **State & Data** | Redux Thunk, React Context API, Axios |
| **Cloud & Backend Services** | AWS Amplify (Cognito Authentication), Firebase (Firestore, Auth, Cloud Messaging) |
| **Real-Time & Communications** | PubNub SDK (Instant Messaging), Web Push Notifications |
| **Payments & Integrations** | Stripe Elements, Google OAuth, Google reCAPTCHA, Leaflet Maps, Mixpanel |
| **Build Tools** | Webpack, Turbopack, React Scripts, React-App-Rewired |

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+ recommended; Node 20 / 22 supported)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### Running the Applications

#### 1. QRTag Website (Next.js)
```bash
cd qrtag-website
npm install
npm run dev
# App will run on http://localhost:3000
```
For production build:
```bash
npm run build
npm start
```

#### 2. QRTag Web App (React 18)
```bash
cd qrtag-web-app
npm install
npm start
# App will run on http://localhost:3000 (or http://localhost:3001 if port 3000 is occupied)
```
For production build:
```bash
npm run build
```

#### 3. QRTag Admin (React 17)
```bash
cd qrtag-admin
npm install
npm start
# App will run on http://localhost:3000 (or next available port)
```
For production build:
```bash
npm run build
```

---

## 🔐 Security & Environment Variables

Environment variables are managed per application. Sample templates (`.env.example`) are provided with placeholder values:

- `qrtag-website/.env.example` &rarr; Copy to `.env.local`
- `qrtag-web-app/.env.example` &rarr; Copy to `.env`
- `qrtag-admin/.env.example` &rarr; Copy to `.env`

> **Note**: Real secrets, service account credentials, access tokens, and private environment files are excluded from version control via `.gitignore`.

---

## 📄 License

This repository is maintained for QRTag frontend development. All rights reserved.
