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

Tracking ongoing development progress and architectural decisions.

🗓️ August 14, 2025
- 🧠 Refactored tooltip system on the Risk Management Calculator using semantic keys and hybrid message resolution.
- ⚡ Improved render safety by optimizing selector logic and memoizing tooltip lookups.

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
📐 Position Sizing Calculator (Coming Soon – part of Advanced Risk Management)
A smart tool to calculate optimal position size based on account balance, stop-loss distance, and risk percentage. It will factor in brokerage charges, and integrate with    your strategy setup table for fast, accurate execution planning.

📊 Dashboard Refinement (In Progress)
Enhancing the dashboard with more granular filters, improved performance metrics, and semantic feedback. Updates include better time-period analysis, grouped trade insights, and smoother selector logic for real-time responsiveness.

⚙️ Settings Panel Upgrade (In Progress)
Refactoring the settings UI for clarity and control. Improvements include broker connection validation, dynamic kill-switch toggles, and contextual tooltips to guide users through risk configuration and API setup
