# React Redux Refresh

A structured React + TypeScript learning project focused on building a task app while revisiting modern React patterns step by step and evolving it toward production-shaped frontend architecture.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v3
- React Router
- Redux Toolkit
- RTK Query
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
- RTK Query queries and mutations
- Caching and invalidation strategies
- Auto-generated hook workflows
- HTTP-style API integration
- Optimistic UI updates
- Rollback-aware mutation flows
- Environment-based API configuration
- API-focused error handling

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
|       |-- tasksApi.test.ts
|       |-- tasksApi.ts
|       |-- TasksPage.integration.test.tsx
|       |-- TasksPage.tsx
|       |-- routes.tsx
|       |-- tasksSelectors.ts
|       |-- tasksSlice.test.ts
|       |-- tasksSlice.ts
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

### Day 8

- RTK Query API slice setup
- Queries vs mutations
- Caching and invalidation
- Auto-generated data hooks
- Query-driven loading and error handling
- Replacing manual async thunk reads and writes
- Leaner async state architecture
- RTK Query endpoint testing

### Day 9

- `fetchBaseQuery`
- Environment-based API configuration
- API DTOs and mapping layers
- Error normalization
- Optimistic create, toggle, and delete flows
- Rollback on failed mutations
- Cache patching vs invalidation
- Production-style loading and error UX

## Current Status

- Day 1 complete
- Day 2 complete
- Day 3 complete
- Day 4 complete
- Day 5 complete
- Day 6 complete
- Day 7 complete
- Day 8 complete
- Day 9 in progress

## Day 9 Goal

Upgrade the task app from local/demo-style RTK Query usage toward a more production-like frontend data flow by learning:

- Real API service boundaries
- Request and response typing
- Optimistic updates
- Rollback on failure
- Cache patching vs invalidation
- Environment-aware API setup
- Cleaner loading and error UX

This day is focused on making the app feel closer to a real API-driven frontend instead of a local persistence demo.

## Day 9 Commit Plan

1. Add the Day 9 roadmap and goals to the docs
2. Add shared environment-based API config
3. Move `tasksApi` to `fetchBaseQuery`
4. Add task DTO and mapper helpers
5. Normalize API errors for UI use
6. Add optimistic create task behavior
7. Add optimistic toggle and delete behavior
8. Add rollback for failed optimistic mutations
9. Improve loading, empty, and error UX
10. Update the interview guide and PDF

## Next Improvements

- Real HTTP API integration instead of local storage base queries
- Optimistic updates for mutations
- Route prefetching and smarter loading heuristics
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

This project is part of a structured React refresh journey aimed at strengthening fundamentals and practicing the kinds of routing, state, testing, caching, and performance decisions used in production frontend applications.
