## Frontend Project Guide – Akademi (React + Vite)

This document is for the next frontend engineer to quickly understand the project structure, how it talks to the backend, and how to run and extend the app.

---

## 1. Tech Stack & Overview

- **Framework**: React (JSX)
- **Bundler/Dev Server**: Vite
- **Language**: JavaScript (with JSX)
- **Styling**: CSS/SCSS/utility classes included in the template
- **State & Data**: Local component state + service layer under `src/services`

The app is a school/education management dashboard, with multiple dashboards (student, teacher, finance, etc.) and many feature modules under `src/jsx`.

---

## 2. Project Structure (High Level)

Key folders under `src`:

- **`src/jsx`**: Main React components and pages.
  - **`src/jsx/components/Dashboard`**: Dashboard-related components such as:
    - `StudentDashboard.jsx`
    - `FinanceDashboard.jsx`
    - `teacher-dashboard.jsx`
  - **`src/jsx/components/Finance`**: Finance-related components:
    - `DebtRecords.jsx`
    - `Payments.jsx`
    - `Receipts.jsx`
  - Additional feature folders live alongside these (authentication, settings, etc.) following the same pattern.

- **`src/services`**:
  - Contains service files responsible for talking to backend APIs.
  - Example: `FinanceService.js` (used by finance components).
  - Each service typically:
    - Exports functions that wrap `fetch` or an HTTP client.
    - Encapsulates endpoint URLs and request/response handling.

- **`public/`**:
  - Static assets served by Vite (logos, static images, etc.).

- **Root config files**:
  - `vite.config.js` – Vite configuration.
  - `eslint.config.js` – ESLint configuration.
  - `package.json` – scripts, dependencies.
  - `README.md` – template readme that came with the theme (keep this intact unless the team decides otherwise).

General convention:

- **Pages/containers** live under `src/jsx/components/**` and are usually composed of smaller UI components.
- **Data-fetching logic** is centralized in **services** under `src/services/**`.
- **Routing** (if present) will be defined in a top-level component in `src/jsx` (look for files involving `react-router` or similar).

---

## 3. How Components Connect to Endpoints

### 3.1 Service Layer (`src/services`)

- Each domain (e.g., finance) has a dedicated service file (e.g., `FinanceService.js`).
- A typical pattern you’ll see:
  - Import the service in a React component.
  - Call service functions inside event handlers or `useEffect` hooks.
  - Update component state with the returned data.

Example (conceptual, not copied from code):

```javascript
import { getStudentDebts } from '../../services/FinanceService';

useEffect(() => {
  async function loadDebts() {
    const response = await getStudentDebts();
    setDebts(response.data);
  }
  loadDebts();
}, []);
```

### 3.2 Where to Look When Working With an Endpoint

- **Finance endpoints**:
  - Start in `src/services/FinanceService.js` to see:
    - Base URLs / route segments used.
    - HTTP methods (GET, POST, PUT, DELETE).
    - How request payloads and headers are constructed.
  - Then check consuming components:
    - `src/jsx/components/Finance/DebtRecords.jsx`
    - `src/jsx/components/Finance/Payments.jsx`
    - `src/jsx/components/Finance/Receipts.jsx`

- **Dashboard data**:
  - Check components in `src/jsx/components/Dashboard` for which services they use.
  - Look for imports from `src/services/**` inside those dashboard files.

When adding a **new endpoint**:

1. **Create or extend a service** in `src/services` (e.g., `StudentService.js`, `TeacherService.js`).
2. Export a clear, purpose-oriented function (e.g., `fetchStudentAttendance`, `createPayment`).
3. Import that function into the relevant component and call it inside `useEffect` or an event handler.

---

## 4. Component Structuring Guidelines

When adding or editing components, follow the existing organizational patterns:

- **Keep dashboards under `src/jsx/components/Dashboard`**:
  - If you create a new role-specific dashboard, place it here (e.g., `ParentDashboard.jsx`).

- **Group feature components by domain**:
  - Finance-related → `src/jsx/components/Finance`
  - Students-related → `src/jsx/components/Students` (if present / when created)
  - Teachers-related → `src/jsx/components/Teachers`, etc.

- **Split complex views**:
  - For very large dashboards, break them into smaller child components and keep them in a subfolder next to the parent (e.g., `Dashboard/Student/`).

- **Use the service layer**:
  - Do not hardcode endpoints inside components.
  - Keep API calls in `src/services/**` and import from there.

- **Follow existing naming conventions**:
  - Components use `PascalCase` filenames: `SomeComponent.jsx`.
  - Services use `CamelCase` functions and clear file names: `FinanceService.js`.

---

## 5. How to Run the Project (Local Dev)

From the real app directory:

```bash
E:\themeforest-T8PfdARq-akademi-react-vite-school-and-education-management-admin-dashboard-template\Vite-Akademi-v1.0-09_Oct_2024\package\package
```

1. **Install dependencies** (only needed initially or when dependencies change):

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

   - Vite will print a local URL (often `http://localhost:5173`).
   - Open that URL in your browser.

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview the production build locally (optional)**:

   ```bash
   npm run preview
   ```

Check `package.json` in this directory for the full list of scripts; the above are the primary ones you’ll need day-to-day.

---

## 6. Git & Branching (Boss Branch)

- The actual git repo root is:

  ```text
  Vite-Akademi-v1.0-09_Oct_2024/package/package
  ```

- To create and push the **`boss`** branch from your current `main` state in PowerShell:

  ```powershell
  cd "E:\themeforest-T8PfdARq-akademi-react-vite-school-and-education-management-admin-dashboard-template\Vite-Akademi-v1.0-09_Oct_2024\package\package"

  # Create and switch to boss branch
  git checkout -b boss

  # Stage your current changes (existing modified files)
  git add src/jsx/components/Dashboard/FinanceDashboard.jsx `
          src/jsx/components/Dashboard/teacher-dashboard.jsx `
          src/jsx/components/Finance/DebtRecords.jsx `
          src/jsx/components/Finance/Payments.jsx `
          src/jsx/components/Finance/Receipts.jsx `
          src/services/FinanceService.js `
          FRONTEND_GUIDE.md

  # Commit
  git commit -m "chore: create boss branch snapshot and add frontend guide"

  # Push and set upstream
  git push -u origin boss
  ```

> **Note**: The commands above assume `origin` is the correct remote and that you want all current local changes (plus this guide) on the `boss` branch.

---

## 7. Onboarding Checklist for a New Frontend Dev

- **Step 1**: Clone the repo and check out `boss` (or the branch your team specifies).
- **Step 2**: `cd` into `Vite-Akademi-v1.0-09_Oct_2024/package/package`.
- **Step 3**: Run `npm install`.
- **Step 4**: Run `npm run dev` and confirm the dashboard loads.
- **Step 5**: Explore:
  - Dashboards in `src/jsx/components/Dashboard`.
  - Finance flows in `src/jsx/components/Finance` + `src/services/FinanceService.js`.
- **Step 6**: When adding features:
  - Put new components in the appropriate `src/jsx/components/**` subfolder.
  - Put new API calls in an appropriate file under `src/services/**`.

This guide should give you enough to navigate, run, and extend the project confidently without changing any existing conventions.


