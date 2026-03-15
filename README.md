# Cribl Log Viewer

A React + TypeScript app that streams NDJSON log data from a URL and renders it in a virtualized, expandable table with a timeline visualization. Built with Vite, CSS Modules, and no UI frameworks.

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
└── LogsTable          table with time + event columns
    └── LogRow         individual row, expand/collapse (coming soon)
```

Streaming: `fetch` → `ReadableStream` → `TextDecoder` → `parseNDJSON` buffers incomplete lines across chunks, parses complete ones. One `dispatch` per chunk to avoid render thrashing.

## Key Decisions

- **Vite** — fast, zero-config TypeScript
- **CSS Modules** — scoped styles, Bulma-inspired design tokens, no CSS framework
- **`useReducer`** — batches streaming state (`logs`, `loading`, `error`) into a single dispatch
- **`table-layout: fixed`** — prevents layout recalculation on every streamed row
- **react-window** — coming soon, for virtualization
