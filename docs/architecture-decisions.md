# Day 14 Architecture Decisions

## ADR-001: State Ownership Strategy

**Decision**: Use local component state for transient UI, Redux slices for client-owned shared data,
and RTK Query for server state.

**Why**: It keeps each layer focused and reduces incidental complexity. Local state stays fast,
Redux keeps shared logic consistent, and RTK Query owns caching and invalidation.

## ADR-002: Service Boundary for API Mapping

**Decision**: Keep request/response DTO mapping in a feature service layer, not in UI components
or in the RTK Query endpoints directly.

**Why**: It isolates transport changes, keeps endpoints readable, and makes mapping testable.

## ADR-003: Layering and Dependency Flow

**Decision**: UI depends on feature components, features depend on state/services, and services depend
on API/infrastructure. UI never imports API or DTO mapping directly.

**Why**: It prevents dependency leaks and keeps feature changes localized.

## ADR-004: Code Splitting Strategy

**Decision**: Use route-level code splitting for full pages and feature-level splits for secondary
panels or heavy subtrees. Keep the app shell eager.

**Why**: It reduces time-to-interactive while avoiding layout shifts.

## ADR-005: Performance Strategy

**Decision**: Use profiling evidence to guide memoization. Prefer caching and prefetching over
premature memoization.

**Why**: It keeps the codebase readable while targeting real bottlenecks.
