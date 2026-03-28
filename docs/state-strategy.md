# Day 14 State Strategy

## Local State

Use for transient UI:
- Form drafts
- Focus/hover state
- Toggle-only UI elements

## Redux Slice

Use for client-owned shared state:
- Feature-level metadata
- UI state that multiple screens rely on
- Derived summaries and selectors

## RTK Query

Use for server state:
- Remote data with caching requirements
- Mutations with invalidation or optimistic flows
- Data that needs to be refetched or preloaded

## Signals That State Is In The Wrong Place

- A UI component needs to drill props through multiple layers.
- You are manually deduplicating server data that RTK Query could cache.
- Local state must survive navigation or refresh.
