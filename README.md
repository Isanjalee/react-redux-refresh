# React Redux Refresh

A structured React + TypeScript learning project focused on building a small task app while revisiting modern React patterns step by step.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v3
- React Router
- Redux Toolkit
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
|       |   |-- TaskForm.tsx
|       |   |-- TaskItem.tsx
|       |   `-- TaskList.tsx
|       |-- storage.ts
|       |-- tasksAdapter.ts
|       |-- tasksSelectors.ts
|       |-- TasksPage.tsx
|       |-- tasksSlice.ts
|       |-- tasksThunks.ts
|       |-- taskUtils.ts
|       `-- types.ts
|-- shared/
|   |-- components/
|   |   `-- Button.tsx
|   `-- hooks/
|       `-- useLocalStorageState.ts
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

## Current Status

- Day 1 complete
- Day 2 complete
- Day 3 complete
- Day 4 complete
- Day 5 complete

## Next Improvements

- Async thunks with real API integration
- RTK Query comparison
- Middleware exploration
- Testing with React Testing Library
- Selector and thunk unit tests

## Installation

```bash
npm install
npm run dev
```

## Purpose

This project is part of a structured React refresh journey aimed at strengthening fundamentals and improving production-oriented frontend architecture.
