# Day 14 Performance Strategy

- Profile first before memoizing.
- Use RTK Query cache and prefetch for expected navigation.
- Keep render trees shallow and avoid heavy re-render cascades.
- Use Suspense boundaries for heavy or non-critical UI.

## Metrics To Watch

- Render duration for list-heavy screens.
- Cache hit rate for common queries.
- Input responsiveness during async mutations.
