# Find-You-Edge

## 📦 Features

- 📊 Dashboard Analytics -
  A dynamic dashboard that visualizes trade records with metrics like average risk-reward, win/loss rate, and daily returns. Users can apply filters to analyze performance across custom timeframes.

- 📈 Google Sheets Sync -
  Direct integration with Google Sheets allows users to push trade records into their personalized edge tables, enabling detailed tracking and external auditability.

- 🗓️ Trade Calendar -
  A calendar view that maps trades to specific days, highlighting winning streaks, best-performing days, and strategy consistency over time.

- 📋 Strategy Definition Table -
  Users can define trading strategies with setup details and upload annotated images directly into the system, creating a visual and data-driven strategy repository.

- 🧪 Backtest Extension -
  A browser-based popup that overlays broker charts, allowing users to enter backtesting data directly from the chart into their edge sheet—bridging live analysis with historical review.

- 📐 Advanced Risk Management Calculator -
  A precision calculator that includes brokerage charges, target/stop-loss placement, and real-time risk profiling. It’s designed to guide traders toward disciplined execution.

- ⚙️ Settings & Broker Integration -
  A settings panel that includes broker connection via API keys and an automatic kill switch that activates when daily risk thresholds are breached—available for supported brokers.

## 🧱 Tech Stack

- Frontend: React, Zustand
- Backend: REST API with Spring Boot, Java, MongoDB, JWT auth, HTTPS, and broker integrations
- Integrations: Google Sheets API, broker APIs (via key-based auth)

## 📌 Daily Updates

<details>
  <summary>Development Log</summary>

🗓️ August 20, 2025

- Added multi-section updater to enable atomic state batching across modules via update.sections.
- Centralized update logic improves traceability, reduces render overhead, and ensures consistent behavior across form components using stable updater references.

🗓️ August 18 Updates

- Merged percent handler into unified pts and amount logic for cleaner risk input management
- Added Clear All button and reset logic to Position Sizing Calculator for instant state wipe and recalculation readiness
- Refactored Reset Section Logic for consistent state cleanup and smoother UX across modules

🗓️ August 17, 2025

- Implemented Position Sizing Calculator with dynamic input handling.

🗓️ August 15, 2025

- Optimized the Risk Management system by merging multiple stores (useCalculatorStore, useTooltipStore, useSettingsStore) into a single useRiskManagementStore.
- Refactored store architecture and centralized state management, using slices (create...()), reducing re-renders and improving performance across the calculator and related components.

🗓️ August 14, 2025

- Refactored tooltip system on the Risk Management Calculator using semantic keys and hybrid message resolution.
- Improved render safety by optimizing selector logic and memoizing tooltip lookups.
</details>

## 🛠️ Project Status

This project is in active development. Core modules are functional, and new features are being added iteratively. The architecture prioritizes performance, reference safety, and developer experience.

## 📚 Setup Instructions

Run the frontend locally using React 19+, Vite, Zustand, and ApexCharts. Backend and broker integrations are under active development.

## 📦 Prerequisites

- Node.js v18 or higher
- npm or yarn

## 🔧 Tech Stack

- React.js v19+
- Vite for fast bundling and hot reload
- Zustand for scalable state management
- ApexCharts for interactive data visualizations

## 🗺️ Roadmap

📊 Pyramiding Calculator (Coming Soon – part of Advanced Risk Management)
A layered scaling tool that models position growth across multiple entries with fixed or dynamic risk increments. Tracks each layer’s entry price, quantity, risk/reward, and cumulative exposure in a structured table. Designed for conviction-based compounding, real-time recalibration, and seamless integration with your strategy setup for disciplined execution.

📊 Dashboard Refinement (In Progress)
Enhancing the dashboard with more granular filters, improved performance metrics, and semantic feedback. Updates include better time-period analysis, grouped trade insights, and smoother selector logic for real-time responsiveness.

⚙️ Settings Panel Upgrade (In Progress)
Refactoring the settings UI for clarity and control. Improvements include broker connection validation, dynamic kill-switch toggles, and contextual tooltips to guide users through risk configuration and API setup
