# Tallinn Delivery App — Test Automation Project

This repository contains a comprehensive automated testing suite built with **Playwright** for the **Tallinn Delivery** application. It serves as a core part of my QA Automation portfolio, showcasing scalable test architecture, network mocking, and custom fixtures.

## 🚀 Key Features & Learning Objectives
- **Page Object Model (POM):** Scalable design pattern using decoupled atomic elements (`Button`, `Input`, `Popup`) and modular page classes.
- **End-to-End (E2E) Testing:** Complete real-world user scenarios verifying end-to-end authorization pipelines, dynamic order generation via Faker, and multi-page navigation flows.
- **Component & Mock Testing:** Comprehensive network intercepting (`page.route`) simulating edge cases, contract boundaries, and specific backend failures (`404 Not Found`, `500 Server Error`).
- **Advanced Playwright Fixtures:** Isolated environment setup using custom fixtures (`auth`, `orderId`, `mainPage`) executing fast pre-requisite API orchestration and seamless browser Local Storage injections.
- **Cross-Browser Verification:** Multi-platform target execution across Chromium, Firefox, and WebKit rendering engines.

## 🛠️ Tech Stack
- **Language:** TypeScript
- **Framework:** Playwright
- **Data Generation:** Faker Library
- **Linting & Formatting:** ESLint, Prettier

## 📂 Project Structure
```plaintext
├── env/                         # Environment configuration templates
├── tests/
│   ├── atoms/                   # Reusable low-level UI components (Input, Button, Popup)
│   ├── fixtures/                # Custom Playwright extensions (API auth, order injectors)
│   ├── pages/                   # Page Object classes (LoginPage, OrderPage, OrderDetailsPage)
│   └── ui/                      # Automated test specifications (E2E, Mocks, Fixtures)
├── utils/                       # Global constant objects, endpoints, and JWT helpers
├── config/                      # Environment-based data loaders
├── playwright.config.ts         # Global test runner adjustments
└── package.json                 # Action scripts and dependencies
```

## ⚙️ Configuration Instructions

### Step 1: Prepare Environment File
Rename the provided `prod.env.example` file to `prod.env` in the root directory of the project.
*(Note: `prod.env` contains real target session secrets and is strictly ignored by Git via `.gitignore` for data safety).*

### Step 2: Fill in Configuration Values
Open your new `prod.env` file and supply your active course credentials:
- **TEST_USERNAME**: The username for the service.
- **TEST_PASSWORD**: The password for the service.
- **URL**: The base frontend application URL.

*Example configuration:*
```plaintext
TEST_USERNAME=myUsername
TEST_PASSWORD=myPassword
URL=https://fe-delivery.tallinn-learning.ee
```

## 🏃 Execution Commands

Install project dependencies and browser binaries first:
```bash
npm install
npx playwright install --with-deps
```

### Run Tests in Headless Mode
```bash
# Run all automated test specs across all engines concurrently
npx playwright test

# Run classic End-to-End test scenarios
npx playwright test e2e-auth-order-flow.spec.ts
npx playwright test e2e-search-order.spec.ts

# Run network mocking test suite (Lesson 22 / Local Storage)
npx playwright test mocks-lesson-22.spec.ts

# Run custom fixtures test suite (Lesson 23 / API Pre-requisites)
npx playwright test fixtures-lesson-23.spec.ts
```

### Run Tests in Interactive Modes
```bash
# Open interactive UI Mode for visual step-by-step debugging
npx playwright test --ui

# Open the standard HTML execution log report
npx playwright show-report
```
