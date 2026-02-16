# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # Install dependencies
npm run generate-certs   # Generate self-signed SSL certs (server.key + server.crt)
npm start                # Start the app (HTTPS on :3443, HTTP redirect on :3000)
```

No test runner is configured (`npm test` is a placeholder).

## Architecture

CopyFlow is a **Pikmin Bloom search string generator** — a PWA that lets users compose search query strings by clicking buttons, then copy the result into the game.

### Server ([app.js](app.js))
Minimal Express 5 backend with no API endpoints. Two servers:
- **HTTPS** on port `3443` — serves static files from `public/pikmin/`
- **HTTP** on port `3000` — redirects all traffic to HTTPS

SSL certs (`server.key`, `server.crt`) must exist in the project root. Generate them with `npm run generate-certs` ([generate-certs.js](generate-certs.js) uses the `selfsigned` devDependency). `server.key` is gitignored; `server.crt` is tracked.

### Frontend ([public/pikmin/](public/pikmin/))
Vanilla HTML/CSS/JS SPA — no frameworks or build step. All UI logic lives in [public/pikmin/script.js](public/pikmin/script.js).

**State model** (three variables in script.js):
- `textToCopyContent` — the accumulated search string
- `nextConnector` — pending logical operator (`&`, `|`, or empty)
- `isNotActive` — whether the NOT (`!`) prefix is queued

Buttons carry their search token in a `data-text` attribute; click handlers read this and append to the string with the appropriate connector/negation. The Copy button writes to the clipboard and shows a toast.

**PWA**: [service-worker.js](public/pikmin/service-worker.js) uses a cache-first strategy. [manifest.json](public/pikmin/manifest.json) enables installation. Theme: Pikmin Bloom blue (`#5dade2`).

The UI is in Traditional Chinese (繁體中文).
