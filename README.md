# Cribl Log Viewer

A React + TypeScript app that streams NDJSON log data from a URL and renders it in a virtualized, expandable table. Built with Vite, CSS Modules, and no UI frameworks.

## CodeSandbox

[Open in CodeSandbox](https://codesandbox.io/p/github/vi-cat/cribl-log-viewer/main?import=true)

Once the sandbox loads, run the following in the terminal to see streaming in action:

```bash
npm run build && npm run preview
```

> Vite's dev server adds middleware overhead that interferes with streaming. The production build serves assets directly, which is required for the `ReadableStream` chunks to flow through correctly.

## Quick Start

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm test
```

## Architecture

```
App
├── ErrorCallout       always rendered, visible only on error
├── LoadingBar         always rendered, pulses while streaming
└── LogsTable          virtualized table with time + event columns
    └── LogRow         expand/collapse row with pretty-printed JSON
```

Streaming: `fetch` → `ReadableStream` → `TextDecoder` → `parseNDJSON` buffers incomplete lines across chunks, parses complete ones. One `dispatch` per chunk to avoid render thrashing.

## Key Decisions

- **Vite** — fast, zero-config TypeScript
- **CSS Modules** — scoped styles, Bulma-inspired design tokens, no CSS framework
- **`useReducer`** — batches streaming state (`logs`, `loading`, `error`) into a single dispatch
- **`react-window` `VariableSizeList`** — virtualizes thousands of rows; expanded row heights are measured via `ResizeObserver` for accuracy
- **Colocated tests** — test files live next to the source files they test, same pattern as CSS modules

## Testing Strategy

Pure utility functions and the streaming hook are covered with Vitest + Testing Library. What I'd add with more time:

- Component tests for expand/collapse interaction
- Integration test for the full streaming pipeline with a mock `ReadableStream`
- E2E test verifying entries render incrementally (not after full download)
