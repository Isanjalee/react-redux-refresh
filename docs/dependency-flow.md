# Day 14 Dependency Flow Rules

1. UI components never import API or DTO mapping directly.
2. Features talk to services or RTK Query endpoints.
3. State layer owns async lifecycles and exposes selectors.
4. API layer owns request/response mapping and validation.
5. Infrastructure is only consumed by API/services.
