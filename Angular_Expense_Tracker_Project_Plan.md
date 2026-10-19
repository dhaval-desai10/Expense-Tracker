# Expense Tracker --- Angular Project Plan

## 1. Project Goal

Build a modern Expense Tracker using Angular, TypeScript, and Tailwind
CSS. The app will help a user record income and expenses, understand
where money goes, set monthly budgets, and review spending over time.

This project follows TaskBuddy. The aim is not just to make another CRUD
app; it is to practise Angular services, dependency injection, reactive
forms, routing, reusable components, derived state with signals, and
eventually HTTP/API integration.

## 2. Recommended Technology

-   **Angular:** Use the Angular version already installed in your
    environment (you have been working with Angular 22).
-   **Language:** TypeScript.
-   **Styling:** Tailwind CSS, keeping custom CSS small.
-   **State:** Angular signals for local/shared UI state where they fit.
-   **Forms:** Reactive Forms for transaction and budget forms.
-   **Charts:** Add a chart library only after the core app works.
-   **First storage:** `localStorage`, so data remains after refreshing
    the browser.
-   **Later upgrade:** Replace local storage with a backend/API when the
    frontend is stable.

Keep the modern standalone Angular structure and concise filenames used
by your current setup, such as `app.ts`, `app.html`, and `app.css`. Do
not add `.component` to filenames if your project convention does not
use it.

## 3. What the Finished App Should Do

### Core features (build these first)

1.  Add an income or expense transaction.
2.  Store amount, title/description, category, date, and transaction
    type.
3.  Show all transactions in a list.
4.  Edit an existing transaction.
5.  Delete a transaction after confirmation.
6.  Filter transactions by type, category, and date/month.
7.  Search transactions by title or description.
8.  Show total income, total expenses, and remaining balance.
9.  Persist transactions in `localStorage`.
10. Show useful empty states and form validation messages.

### Second-stage features

11. Set a monthly budget.
12. Show budget used, remaining budget, and overspending warnings.
13. Display spending by category in a chart.
14. Display a monthly income-versus-expense summary.
15. Add pagination or a "show more" control if the transaction list
    becomes long.
16. Add responsive layouts for mobile, tablet, and desktop.

### Optional advanced features (only after the core app is reliable)

17. Export transactions to CSV.
18. Add light/dark mode.
19. Add recurring transactions.
20. Add login and a backend database.
21. Add an API-based currency conversion feature if it serves a real
    need.

Do not attempt every advanced feature at the beginning. Finish each
phase and test it before moving on.

## 4. Main Screens

### A. Dashboard (`/dashboard`)

Purpose: Give a quick view of the user's finances. - Summary cards:
Total Income, Total Expenses, Current Balance, Monthly Budget
Remaining. - Recent transactions. - Spending by category chart (later
phase). - Monthly income-versus-expense chart (later phase). - Quick
action button: "Add transaction".

### B. Transactions (`/transactions`)

Purpose: Manage all recorded transactions. - Search field. - Filters for
income/expense, category, and month. - Transaction list/table. - Add,
edit, and delete actions. - Empty state when there are no matching
results.

### C. Add/Edit Transaction (`/transactions/new` and `/transactions/:id/edit`)

Purpose: Create or update a transaction. - Type: Income or Expense. -
Title/description. - Amount. - Category. - Date. - Save and cancel
actions. - Validation messages. - Reuse the same form component for
adding and editing.

### D. Budgets (`/budgets`)

Purpose: Set and review spending limits. - Choose month and category. -
Set budget amount. - Show spent amount and remaining amount. - Warn when
the user is near or over budget.

### E. Settings (`/settings`) --- optional

-   Currency symbol.
-   Clear local data with a clear confirmation.
-   Theme preference, if dark mode is implemented.

For the first working version, it is acceptable to keep Add/Edit as a
modal or section inside the Transactions screen. Introduce separate
routes when you are ready to practise routing.

## 5. Suggested Folder Structure

Use this as the target structure. Create files gradually; do not
generate every component before you need it.

``` text
src/
└── app/
    ├── app.ts
    ├── app.html
    ├── app.css
    ├── app.routes.ts
    │
    ├── core/
    │   └── services/
    │       ├── transaction.service.ts
    │       ├── budget.service.ts
    │       └── storage.service.ts
    │
    ├── shared/
    │   ├── components/
    │   │   ├── app-header/
    │   │   ├── summary-card/
    │   │   ├── empty-state/
    │   │   └── confirm-dialog/
    │   └── pipes/                 # optional, only if a custom pipe is useful
    │
    ├── features/
    │   ├── dashboard/
    │   │   ├── dashboard.ts
    │   │   ├── dashboard.html
    │   │   └── dashboard.css
    │   │
    │   ├── transactions/
    │   │   ├── transactions.ts
    │   │   ├── transactions.html
    │   │   ├── transactions.css
    │   │   ├── transaction-form/
    │   │   └── transaction-item/
    │   │
    │   └── budgets/
    │       ├── budgets.ts
    │       ├── budgets.html
    │       └── budgets.css
    │
    └── models/
        ├── transaction.model.ts
        └── budget.model.ts
```

Angular CLI may generate slightly different filenames depending on your
configuration. Follow the filenames actually generated by your project.

### Why separate these areas?

-   **features/** contains screens and feature-specific components.
-   **shared/components/** contains UI pieces reused in different
    screens.
-   **core/services/** contains app-wide data and storage logic.
-   **models/** defines the shape of data, so components and services
    agree on fields.
-   **app.routes.ts** defines which screen appears at each URL.

Do not move code into a service just to make the project look advanced.
Move it when the logic is shared, handles data, or should not belong to
a UI component.

## 6. Data Models

### Transaction

Each transaction should contain:

-   `id`: unique string.
-   `title`: short label, such as "Groceries" or "Salary".
-   `amount`: positive number.
-   `type`: `'income'` or `'expense'`.
-   `category`: a category such as Food, Travel, Shopping, Bills,
    Salary, or Other.
-   `date`: date string in a consistent format such as `YYYY-MM-DD`.
-   `note`: optional extra detail.

Important rule: store the amount as a positive number and use `type` to
decide whether it is income or expense. This avoids confusing negative
values with transaction types.

Example shape (illustrative only):

``` ts
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
}
```

### Budget

A budget should contain: - `id`: unique string. - `category`: category
being limited. - `month`: a consistent month identifier such as
`YYYY-MM`. - `limit`: positive amount.

Example shape (illustrative only):

``` ts
export interface Budget {
  id: string;
  category: string;
  month: string;
  limit: number;
}
```

Keep the model simple at first. You can later replace `category: string`
with a stricter union type if it improves safety.

## 7. Learning Roadmap --- Build in This Order

### Phase 0 --- Project setup and structure

**Goal:** Get a clean project foundation.

Tasks: 1. Create the project with the Angular CLI, using the same
routing and Tailwind setup you already know. 2. Run the app and confirm
it loads. 3. Create the model files. 4. Sketch the main page layout
before implementing every feature. 5. Create only the first feature
component you need.

Learn: - Angular project structure. - Standalone components and
imports. - Why models/interfaces are useful. - How to keep app-level
files small.

Done when: - The app starts without errors. - The model files compile. -
The initial layout is visible.

### Phase 1 --- Dashboard layout with sample data

**Goal:** Build the visible UI before storage and complex logic.

Tasks: 1. Create a header/navigation. 2. Create summary cards. 3. Create
a recent-transactions section. 4. Use a small temporary array of sample
transactions. 5. Make the layout responsive with Tailwind.

Learn: - Component composition. - Input bindings for reusable cards. -
`@for` to render lists. - `@if` to show empty states. - Tailwind
responsive utilities.

Done when: - The page looks organised on desktop and mobile. - Summary
cards and sample transactions render correctly.

### Phase 2 --- Transaction list and transaction form

**Goal:** Add the first real feature.

Tasks: 1. Create the Transactions screen. 2. Create a `TransactionForm`
component. 3. Use Reactive Forms with required-field and positive-amount
validation. 4. Let the user choose income or expense. 5. Submit the form
and display the new transaction. 6. Show clear validation messages.

Learn: - Reactive Forms and `FormBuilder`. - Form controls and
validators. - Parent-child communication using inputs/outputs, or a
service when appropriate. - TypeScript models and safe handling of user
input.

Done when: - Valid data can be added. - Invalid data cannot be saved. -
The new transaction appears in the list.

### Phase 3 --- Move data logic into a service

**Goal:** Stop keeping all transaction logic inside a page component.

Tasks: 1. Create `TransactionService`. 2. Keep the transaction
collection in a signal. 3. Add methods such as `addTransaction`,
`updateTransaction`, `deleteTransaction`, and `getTransactions` (or
expose a read-only signal and suitable methods). 4. Make components use
the service instead of duplicating data logic. 5. Use Angular dependency
injection to provide the service.

Learn: - Services and dependency injection. - Signals and read-only
state. - Separation between UI and business logic. - Why multiple
components should share one source of truth.

Done when: - Adding or deleting a transaction updates the list. -
Components do not maintain separate, conflicting copies of the same
data.

### Phase 4 --- Save data in localStorage

**Goal:** Keep transactions after refreshing the browser.

Tasks: 1. Create a small storage service or storage helper. 2. Load
saved transactions when the app starts. 3. Save changes whenever
transactions are added, edited, or deleted. 4. Handle missing or invalid
stored JSON safely. 5. Test by adding data, refreshing, and checking
that it remains.

Learn: - `localStorage`. - JSON serialization with `JSON.stringify` and
`JSON.parse`. - Browser storage limitations. - Keeping persistence logic
separate from presentation.

Done when: - Data survives a browser refresh. - The app does not crash
when storage is empty or contains invalid data.

Note: `localStorage` is browser-specific and not a secure database. Do
not store passwords, payment details, or sensitive financial account
data in it.

### Phase 5 --- Edit and delete transactions

**Goal:** Complete the main CRUD workflow.

Tasks: 1. Add an Edit action to each transaction. 2. Reuse the
transaction form for both create and edit. 3. Load the selected
transaction's existing values into the form. 4. Update the transaction
by ID. 5. Add a delete confirmation. 6. Make sure the saved list updates
immediately.

Learn: - Route parameters or selected-item state. - Patching form
values. - Updating arrays immutably. - Reusing components without
duplicating forms.

Done when: - Editing changes the correct record. - Cancel does not
modify the original record. - Deleting removes the record and its stored
copy.

### Phase 6 --- Dashboard calculations

**Goal:** Turn raw transactions into useful summaries.

Calculate: - Total income. - Total expenses. - Current balance = total
income − total expenses. - This month's income and expenses. - Recent
transactions.

Use `computed()` signals for values derived from the transaction
collection. Do not manually update summary totals in every
add/edit/delete handler; derive them from the source data so totals stay
correct.

Done when: - Adding, editing, or deleting a transaction updates all
summary cards correctly. - Test cases include income, expense, and
transactions from different months.

### Phase 7 --- Search, filters, and sorting

**Goal:** Make the transaction list useful when it grows.

Tasks: 1. Search title and note. 2. Filter by transaction type. 3.
Filter by category. 4. Filter by month/date range. 5. Sort by date or
amount. 6. Show a useful "No matching transactions" message.

Learn: - Signals for filter state. - `computed()` for filtered
results. - Array methods such as `filter`, `sort`, and `toLowerCase`. -
Avoid mutating the original transaction array while sorting.

Done when: - Filters can be combined. - Clearing filters restores the
full list. - Search and filters do not alter saved transactions.

### Phase 8 --- Routing and app structure

**Goal:** Make it feel like a multi-page application.

Suggested routes: - `/dashboard` - `/transactions` -
`/transactions/new` - `/transactions/:id/edit` - `/budgets`

Tasks: 1. Define routes in `app.routes.ts`. 2. Keep a shared
header/navigation. 3. Add router links and active-link styling. 4. Use
route parameters to identify the transaction being edited. 5. Handle an
invalid transaction ID gracefully. 6. Add a not-found route if desired.

Learn: - Angular Router. - `routerLink` and `router-outlet`. - Route
parameters. - Route configuration and navigation.

Done when: - Direct navigation to each route works. - Refreshing a route
does not break the app. - Invalid edit IDs show a useful message or
redirect.

### Phase 9 --- Monthly budgets

**Goal:** Add a feature that uses the transaction system.

Tasks: 1. Create a budget form for category, month, and limit. 2. Save
budgets using a `BudgetService`. 3. Calculate expenses for each budget's
category and month. 4. Show spent, remaining, and percentage used. 5.
Warn when a budget reaches a chosen threshold or is exceeded. 6. Persist
budgets in localStorage.

Learn: - Reusing form patterns. - Derived calculations. - Working with
two related data collections. - Edge cases such as zero budget and no
expenses.

Done when: - A budget is calculated for the correct category and
month. - Income does not count as spending. - Updating a transaction
updates the relevant budget usage.

### Phase 10 --- Charts and final polish

**Goal:** Improve the visual summary after the data logic is reliable.

Tasks: 1. Add a category spending chart. 2. Add a monthly
income-versus-expense chart. 3. Add loading/empty states where relevant.
4. Check keyboard access, readable labels, and contrast. 5. Test mobile,
tablet, and desktop layouts. 6. Add CSV export if desired.

Learn: - Integrating a third-party Angular-compatible library. -
Transforming transaction data into chart data. - Responsive UI and
accessibility basics.

Done when: - Charts match the totals shown elsewhere. - The app remains
usable on small screens. - No major console errors remain.

### Phase 11 --- Optional API/backend upgrade

**Goal:** Practise real-world data fetching only after the local version
works.

Tasks: 1. Choose a backend/API and define transaction endpoints. 2.
Configure Angular `HttpClient`. 3. Move data access behind a service. 4.
Add loading, success, and error states. 5. Replace local storage with
API persistence, or deliberately keep local storage as an offline cache.
6. Add authentication only if the project genuinely needs multiple
users.

Learn: - HTTP requests. - Observables and basic RxJS. - API error
handling. - Environment configuration. - The difference between frontend
validation and server-side validation.

Do not put API secrets in frontend code.

## 8. Component Responsibilities

  -----------------------------------------------------------------------
  Component                           Responsibility
  ----------------------------------- -----------------------------------
  `App`                               App shell and router outlet

  `AppHeader`                         Navigation and app title

  `Dashboard`                         Financial summary and recent
                                      activity

  `SummaryCard`                       Reusable title/value card

  `Transactions`                      Search, filters, and transaction
                                      list

  `TransactionForm`                   Create/edit transaction form

  `TransactionItem`                   Display one transaction and its
                                      actions

  `Budgets`                           Budget creation and budget progress

  `EmptyState`                        Reusable empty-list message

  `ConfirmDialog`                     Confirm destructive actions, if you
                                      build a reusable dialog
  -----------------------------------------------------------------------

Start with fewer components if that helps you understand the flow.
Extract a component when it has a clear responsibility or is reused.

## 9. Service Responsibilities

### `TransactionService`

-   Owns the transaction state.
-   Adds, updates, and deletes transactions.
-   Exposes transactions and computed totals.
-   Coordinates persistence.

### `BudgetService`

-   Owns budget state.
-   Adds, updates, and deletes budgets.
-   Calculates budget usage from expenses.

### `StorageService` (optional)

-   Reads and writes JSON data to localStorage.
-   Handles storage errors.
-   Keeps browser storage calls out of UI components.

For a small first version, transaction persistence can live in
`TransactionService`. Extract `StorageService` when the extra separation
makes the code clearer.

## 10. UI Design Direction

Use a clean personal-finance dashboard style: - Neutral background with
white or lightly tinted cards. - One primary accent color. - Clear
labels and consistent spacing. - Income and expense visually
distinguishable, but not by color alone. - Summary cards across the
top. - Transaction list with title, category, date, amount, and
actions. - Obvious primary button for adding a transaction. - Responsive
navigation and layouts. - Helpful empty states instead of blank
sections.

Use Tailwind utility classes for most styling. Avoid spending too much
time on decoration before the core behaviour works.

## 11. Testing Checklist

### Transactions

-   [ ] Add income.
-   [ ] Add expense.
-   [ ] Reject an empty title.
-   [ ] Reject zero or negative amount.
-   [ ] Edit title, amount, category, and date.
-   [ ] Delete the correct transaction.
-   [ ] Confirm cancel does not delete anything.

### Calculations

-   [ ] Balance equals income minus expenses.
-   [ ] Income is not counted as spending.
-   [ ] Monthly totals ignore transactions outside the selected month.
-   [ ] Editing/deleting changes the totals correctly.

### Persistence

-   [ ] Data survives refresh.
-   [ ] Empty storage starts with a usable empty state.
-   [ ] Invalid stored JSON does not crash the app.
-   [ ] Clearing data requires confirmation.

### Search and filters

-   [ ] Search is case-insensitive.
-   [ ] Type and category filters work together.
-   [ ] Month filter works across month boundaries.
-   [ ] No-result state appears when appropriate.

### Budgets and UI

-   [ ] Budget uses only expenses in the selected month/category.
-   [ ] Over-budget warning appears correctly.
-   [ ] Layout works on mobile and desktop.
-   [ ] Buttons have clear labels and can be used with a keyboard.
-   [ ] No major errors appear in the browser console.

## 12. Git Checkpoints

Commit after each meaningful milestone: 1.
`chore: set up expense tracker structure` 2.
`feat: add dashboard layout` 3. `feat: add transaction form and list` 4.
`feat: add transaction service` 5. `feat: persist transactions locally`
6. `feat: edit and delete transactions` 7.
`feat: calculate dashboard summaries` 8. `feat: add transaction filters`
9. `feat: add routing` 10. `feat: add monthly budgets` 11.
`feat: add spending charts`

Commit names can differ; the point is to keep each working milestone
recoverable.

## 13. Rules for Learning While Building

1.  Build one phase at a time.
2.  Run the app after each meaningful change.
3.  Understand what each new Angular feature solves before using it.
4.  Keep components focused on UI and user interaction.
5.  Keep reusable data logic in services.
6.  Use signals for reactive state and `computed()` for values derived
    from that state.
7.  Do not add a library just because it exists; add it when a feature
    needs it.
8.  Test the feature manually before starting the next phase.
9.  When an error occurs, read the error and fix the cause instead of
    rewriting unrelated files.
10. Do not copy the entire project at once. Build it in small steps and
    try recreating each step yourself.

## 14. First Session --- What to Do Now

Only complete these tasks first:

1.  Create a new Angular project named `expense-tracker` (or use your
    preferred project name).
2.  Enable routing and use the Tailwind setup you already know.
3.  Start the app and confirm it runs.
4.  Create `models/transaction.model.ts` and `models/budget.model.ts`.
5.  Create the initial `features/dashboard` component.
6.  Build only the page shell: header, summary-card placeholders, and an
    empty recent-transactions section.
7.  Stop and review the folder structure before adding forms or
    services.

**Do not build the entire application in the first session.** The target
is a clear structure and a working dashboard shell. After that, proceed
to Phase 2 and add the first real transaction flow.
