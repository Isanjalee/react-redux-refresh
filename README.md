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
- Runtime schema validation
- Form and API contract safety
- Observability and monitoring UX
- Accessibility and inclusive UX
- Architecture strategy and system design thinking

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
|       |   |-- TasksInsightsPanel.tsx
|       |   |-- TasksPagination.tsx
|       |   `-- TasksQueryToolbar.tsx
|       |-- services/
|       |   `-- tasksService.ts
|       |-- storage.ts
|       |-- taskDtos.ts
|       |-- tasksAdapter.ts
|       |-- tasksApi.test.ts
|       |-- tasksApi.ts
|       |-- tasksHttp.ts
|       |-- TasksPage.integration.test.tsx
|       |-- TasksPage.tsx
|       |-- routes.tsx
|       |-- tasksSelectors.ts
|       |-- tasksSlice.test.ts
|       |-- tasksSlice.ts
|       |-- taskUtils.ts
|       `-- types.ts
|-- shared/
|   |-- api/
|   |   |-- apiConfig.ts
|   |   `-- apiErrors.ts
|   |-- components/
|   |   |-- AppShell.tsx
|   |   |-- Button.tsx
|   |   |-- DiagnosticsPanel.tsx
|   |   |-- ErrorBoundary.tsx
|   |   |-- LoadingPanel.tsx
|   |   |-- PageLoader.tsx
|   |   `-- RenderProfiler.tsx
|   |-- hooks/
|   |   `-- useLocalStorageState.ts
|   `-- telemetry/
|       `-- TelemetryProvider.tsx
|-- test/
|   |-- setup.ts
|   `-- test-utils.tsx
|-- index.css
|-- vite-env.d.ts
|-- docs/
|   |-- interview-guide.html
|   |-- interview-guide.pdf
|   |-- architecture.md
|   |-- architecture-decisions.md
|   |-- architecture-diagram.mmd
|   |-- code-splitting.md
|   |-- dependency-flow.md
|   |-- performance-strategy.md
|   `-- state-strategy.md
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

### Day 10

- URL-driven task query state
- Search, filter, and pagination query args
- Paginated RTK Query responses
- DTO mapping for paginated task data
- Adjacent-page prefetching
- Query-aware loading and empty states
- Reusable search and pagination controls
- Scalable list-screen architecture

### Day 11

- Runtime schema validation
- Safer form input parsing
- Query-param contract validation
- API request and response validation
- Centralized schema-driven error handling
- Stronger boundaries between transport data and UI state

### Day 12

- Client-side error boundaries
- Operational logging for user flows
- Lightweight telemetry hooks
- Safe error surfaces for async UI
- Non-blocking failure notifications
- Debug-friendly diagnostics panels

### Day 13

- Semantic landmarks and labeling
- Keyboard-first interaction support
- Accessible form validation states
- ARIA live regions for async updates
- Inclusive status, loading, and error feedback

### Day 14

- State strategy for Redux vs RTK Query vs local state
- Layered frontend architecture boundaries
- Dependency flow rules between UI, features, and services
- Code splitting strategy guidance
- Performance strategy and profiling considerations
- Architecture decision documentation

## Current Status

- Day 1 complete
- Day 2 complete
- Day 3 complete
- Day 4 complete
- Day 5 complete
- Day 6 complete
- Day 7 complete
- Day 8 complete
- Day 9 complete
- Day 10 complete
- Day 11 complete
- Day 12 complete
- Day 13 complete
- Day 14 complete

## Day 14 Goal

Move from feature implementation to system design thinking by learning:

- state strategy (Redux vs RTK Query vs local state)
- layered architecture and dependency flow
- code splitting strategies
- performance and caching strategies
- documenting architecture decisions

This day is focused on documenting and reinforcing architectural boundaries that scale to larger apps.

## Day 14 Commit Plan

1. Add Day 14 roadmap and architecture goals to the docs
2. Document the layered architecture model
3. Record state strategy (Redux vs RTK Query vs local)
4. Clarify dependency flow rules between layers
5. Document code splitting strategy
6. Capture performance strategy and profiling triggers
7. Separate a tasks service layer from the RTK Query slice
8. Update README structure and architecture notes
9. Extend the interview guide with Day 14 architecture concepts
10. Regenerate the interview guide PDF

## Architecture Notes

See `docs/architecture.md` for the Day 14 architecture diagram and decision log.
Additional references:
- `docs/architecture-decisions.md`
- `docs/architecture-diagram.mmd`
- `docs/state-strategy.md`
- `docs/dependency-flow.md`
- `docs/code-splitting.md`
- `docs/performance-strategy.md`

## Next Improvements

- Replace the fetch adapter with a real backend service
- Persist URL-driven query state across more feature routes
- Add server-backed sorting and richer list metadata
- Add optimistic handling for clear-completed mutations
- E2E coverage for multi-page browser flows

## Installation

```bash
npm install
npm run dev
npm test
npm run build
```

## Purpose

This project is part of a structured React refresh journey aimed at strengthening fundamentals and practicing the kinds of routing, state, testing, caching, pagination, and performance decisions used in production frontend applications.










