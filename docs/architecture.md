# Day 14 Architecture Notes

## Goal

Move from feature implementation to system design thinking. This document captures the architecture
choices that keep the app scalable as features grow.

## Layering Model

```text
UI Layer (screens, layout, form controls)
  ↓
Feature Layer (feature components, feature hooks, routing)
  ↓
State Layer (Redux slices, RTK Query endpoints, selectors)
  ↓
API Layer (DTO mapping, request builders, schema parsing)
  ↓
Infrastructure (fetch adapters, storage, telemetry)
```

## State Strategy

Use the smallest scope that satisfies the use case.

| State type | Use it for | Example in this app |
| --- | --- | --- |
| Local component state | Temporary UI and form drafts | Task title input, touched flags |
| Redux (slice) | Client-owned data shared across the app | Task stats, mutation metadata |
| RTK Query | Server data + caching + mutations | Paginated tasks, query cache |

## Dependency Flow Rules

- UI never depends directly on API or infrastructure.
- Features depend on services, not raw transport functions.
- State owns async lifecycles and exposes selectors.
- API layer owns DTO mapping and schema validation.
- Infrastructure only handles transport and platform concerns.

## Code Splitting Strategy

- Route-based splitting for full pages.
- Feature-based splitting for heavy secondary panels.
- Keep shared shell and data providers eager to avoid layout shifts.

## Performance Strategy

- Memoize only when a profiler proves cost.
- Use RTK Query caching and prefetch for common navigation paths.
- Prefer lazy loading for non-critical panels over global loading spinners.

## Architecture Decisions (Why)

### Redux vs Local State

Redux is used when multiple screens or components need the same data or when async
lifecycles must be consistent. Local state stays in a component when the data is
ephemeral or UI-specific.

### RTK Query vs Thunks

RTK Query is used for server state because it owns caching, invalidation, and
request lifecycles, reducing boilerplate and making data flow predictable.

### Validation Layer

Schema validation protects the UI from invalid URL params, form input, storage,
and API payloads. It keeps trust boundaries explicit and failures readable.

## Folder Mapping

```text
src/
|-- app/                 # application wiring
|-- features/
|   `-- tasks/
|       |-- components/  # feature UI
|       |-- services/    # API/service boundary
|       |-- tasksApi.ts  # RTK Query + state layer
|       |-- taskDtos.ts  # API layer DTO mapping
|       |-- tasksHttp.ts # infrastructure adapter
|       `-- taskSchemas.ts # validation
|-- shared/
|   |-- api/             # shared API config and error formatting
|   |-- components/      # shared UI components
|   `-- telemetry/       # observability infra
```
