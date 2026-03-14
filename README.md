# React Redux Refresh

A structured React + TypeScript learning project focused on building a task app while revisiting modern React patterns step by step and evolving it toward production-shaped frontend architecture.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v3
- React Router
- Redux Toolkit
- Vitest
- React Testing Library
- ESLint

## Project Goals

This repository is used to practice:

- Modern React fundamentals
- Feature-based architecture
- Reusable components
- Performance optimization
- Redux Toolkit patterns
- Async state management
- Normalized Redux architecture
- Memoized selector design
- Redux DevTools debugging
- Reducer and thunk testing
- React Testing Library workflows
- Redux + UI integration testing
- Route-level code splitting
- Lazy loading with Suspense
- Feature-level routing
- Bundle optimization and profiling
- Advanced component architecture

## Project Structure

```text
src/
|-- app/
|   |-- App.tsx
|   |-- hooks.ts
|   |-- routes.tsx
|   `-- store.ts
|-- features/
|   `-- tasks/
|       |-- components/
|       |   |-- TaskFilters.tsx
|       |   |-- TaskForm.test.tsx
|       |   |-- TaskForm.tsx
|       |   |-- TaskItem.tsx
|       |   |-- TaskList.tsx
|       |   `-- TasksInsightsPanel.tsx
|       |-- storage.ts
|       |-- tasksAdapter.ts
|       |-- TasksPage.integration.test.tsx
|       |-- TasksPage.tsx
|       |-- routes.tsx
|       |-- tasksSelectors.ts
|       |-- tasksSlice.test.ts
|       |-- tasksSlice.ts
|       |-- tasksThunks.test.ts
|       |-- tasksThunks.ts
|       |-- taskUtils.ts
|       `-- types.ts
|-- shared/
|   |-- components/
|   |   |-- AppShell.tsx
|   |   |-- Button.tsx
|   |   |-- LoadingPanel.tsx
|   |   |-- PageLoader.tsx
|   |   `-- RenderProfiler.tsx
|   `-- hooks/
|       `-- useLocalStorageState.ts
|-- test/
|   |-- setup.ts
|   `-- test-utils.tsx
|-- index.css
`-- main.tsx
```

## Learning Progress

### Day 1

- React + TypeScript setup
- Routing with React Router
- Tasks MVP
- Controlled inputs
- Local state management
- Basic localStorage persistence

### Day 2

- Tailwind CSS integration
- Custom hooks
- `React.memo`
- `useMemo`
- `useCallback`
- Reusable button component
- Performance-focused component structure

### Day 3

- Redux Toolkit integration
- Centralized store setup
- `createSlice`
- Typed Redux hooks
- Selector-based subscriptions
- Redux-based state persistence

### Day 4

- `createAsyncThunk`
- Async local storage service layer
- Request lifecycle handling
- Loading and error UI states
- Thunk-driven task mutations

### Day 5

- `createEntityAdapter`
- Normalized entity state
- Memoized selector modules
- Separated thunks, selectors, and reducers
- Redux DevTools trace-friendly store setup
- Per-operation async request metadata

### Day 6

- Unit testing reducers
- Testing async thunks
- Testing React components
- Mocking APIs with `vi.mock`
- Integration testing Redux + UI together
- Vitest + React Testing Library setup

### Day 7

- Route-level code splitting
- Lazy loading with `React.lazy`
- `Suspense` route fallbacks
- Feature-level routing with `createBrowserRouter`
- Shared app shell architecture
- Bundle optimization with deferred secondary UI
- Dev-only render profiling with `React.Profiler`
- Advanced component boundaries for route and feature shells

## Current Status

- Day 1 complete
- Day 2 complete
- Day 3 complete
- Day 4 complete
- Day 5 complete
- Day 6 complete
- Day 7 complete

## Next Improvements

- Route prefetching and smarter loading heuristics
- RTK Query comparison
- Real HTTP API integration instead of localStorage service mocks
- Profiler-driven tuning against larger data sets
- E2E coverage for full browser flows

## Installation

```bash
npm install
npm run dev
npm test
npm run build
```

## Purpose

This project is part of a structured React refresh journey aimed at strengthening fundamentals and practicing the kinds of routing, state, testing, and performance decisions used in production frontend applications.
