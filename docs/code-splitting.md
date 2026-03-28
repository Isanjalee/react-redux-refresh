# Day 14 Code Splitting Strategy

- Split by route for top-level screens.
- Split by feature for heavy secondary panels or long lists.
- Keep the app shell eager to avoid layout flashes.
- Prefer loading panels that preserve context over blank screens.
