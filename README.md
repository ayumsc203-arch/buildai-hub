# 🚀 BuildAI Hub — Curated AI Tools Directory & Comparison Matrix

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express_5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_%26_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **BuildAI Hub** is a modern, full-stack platform designed for developers, founders, and creators to discover, compare, review, and submit next-generation AI website builders, app generators, and coding assistants.

---

## ✨ Key Features

### 🔍 1. Instant Search & Multi-Criteria Filtering
- **Live Autocomplete**: Instant search suggestions by name, description, tags, features, and tech stacks.
- **Deep Filter System**: Filter by Pricing (*Free, Freemium, Paid*), Platforms (*Web, Mac, Windows, iOS, Android*), and Technologies (*React, Next.js, Python, Node.js*).
- **Dynamic Sorting**: Sort by *Most Popular*, *Highest Rated*, *Newest*, and *Dynamic Trending Score*.

### ⚖️ 2. Side-by-Side Comparison Engine (`/compare`)
- Select up to **4 tools** simultaneously.
- Compare specs across pricing, database integration, auth support, code export capabilities, API availability, and hosting.
- Floating bottom drawer for seamless comparison management from any page.

### 📤 3. Tool Submission Portal with Disk Persistence (`/submit`)
- Community submission form with input validation and instant live directory publishing.
- **Dual Persistence Architecture**: Every tool is stored in **MongoDB** and mirrored to local disk storage (`server/data/persistent_tools.json`), ensuring submitted tools are permanently retained across server restarts.

### 📊 4. Admin Management & Analytics Portal (`/admin`)
- Real-time platform metrics: total tools, categories, submissions, reviews, and registered users.
- Tool management: Add, edit, delete, toggle Featured/Trending status, and approve/reject submissions.
- Interactive telemetry charts tracking views, search queries, and outbound website clicks.

### 🔗 5. Outbound Product Redirection
- Direct **"Visit Site"** buttons opening the genuine external product URL in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).
- Outbound click telemetry logging.

### 🎨 6. Modern Startup Aesthetics & Accessibility
- Sleek dark theme with radiant ambient gradients and Tailwind micro-interactions.
- Keyboard shortcuts (`Ctrl + K` / `Cmd + K` search focus).
- Responsive across mobile, tablet, and widescreen desktop monitors.

---

## 🏗️ Architecture & Tech Stack

```text
buildweb/
├── public/                 # Static assets, favicon, robots.txt, sitemap.xml
├── src/                    # Frontend React 18 Application
│   ├── components/         # Reusable UI components & modals
│   ├── context/            # AuthContext, ThemeContext, ToastContext
│   ├── data/               # Seed categories and initial tool definitions
│   ├── hooks/              # Custom hooks (useFavorites, useCompare, useSEO)
│   ├── pages/              # Route pages (Home, Category, ToolDetail, Compare, Submit, Admin)
│   ├── services/           # API client and backend connectors
│   ├── types/              # Central TypeScript interfaces and data models
│   ├── App.tsx             # Main routing and global state
│   └── main.tsx            # React application entry point
├── server/                 # Backend Node.js & Express REST API
│   ├── models/             # Mongoose schemas (Tool, Category, User, Review, Submission)
│   ├── routes/             # REST API routers (auth, tools, categories, reviews, admin, analytics)
│   ├── db.ts               # MongoDB connector with auto-booting embedded fallback
│   ├── seed.ts             # Platform initialization and disk-restore seeder
│   ├── storage.ts          # JSON file disk-persistence engine
│   └── index.ts            # Express server entry point
├── start.bat               # 1-Click Windows execution script
├── vite.config.ts          # Vite configuration with /api reverse proxy
└── package.json            # Project dependencies and concurrent scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- *(Optional)* Local MongoDB instance. If not installed, BuildAI Hub automatically provisions an embedded in-memory MongoDB server for zero-setup execution.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/buildai-hub.git
   cd buildai-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```
   *(On Windows, you can also simply double-click `start.bat`)*

4. **Open in browser:**
   - **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
   - **Backend API & Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Configured Test Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@buildaihub.io` | `admin1234` | Full access to `/admin` management & analytics |
| **Demo User** | `user@buildaihub.io` | `user1234` | Reviews, favorites, personal profile |

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & diagnostics | No |
| `GET` | `/api/tools` | Fetch directory tools with search, filter, and sorting | No |
| `GET` | `/api/tools/:slug` | Fetch single tool details & increment views | No |
| `POST` | `/api/tools/:slug/click` | Log outbound link click | No |
| `GET` | `/api/categories` | List all tool categories | No |
| `POST` | `/api/submissions` | Submit new AI tool (auto-published with disk sync) | No (Optional) |
| `POST` | `/api/auth/login` | User authentication & JWT token generation | No |
| `POST` | `/api/auth/signup` | Register new user account | No |
| `GET` | `/api/admin/stats` | Platform statistics and metrics | Admin |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue for feature suggestions and improvements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
