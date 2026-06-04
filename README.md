# knowledge-rag-demo-web

Minimal React + Vite frontend for `knowledge-rag-demo`.

## Current scope

- Calls `GET /health`
- Calls `GET /ai/ping`
- Reserves layout for future `/rag/ask` and citation rendering

## Run

```bash
npm install
npm run dev
```

## Backend base URL

By default, the frontend calls:

```text
http://localhost:8080
```

You can override it with:

```bash
VITE_API_BASE_URL=http://your-host:port
```
