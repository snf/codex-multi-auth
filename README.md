# codex-multi-auth

[![npm version](https://img.shields.io/npm/v/codex-multi-auth.svg)](https://www.npmjs.com/package/codex-multi-auth)
[![npm downloads](https://img.shields.io/npm/dw/codex-multi-auth.svg)](https://www.npmjs.com/package/codex-multi-auth)

OpenCode plugin that routes OpenAI SDK traffic through the ChatGPT Codex backend using OAuth, with multi-account rotation and Codex CLI state sync.

> [!NOTE]
> Renamed from `opencode-openai-codex-auth-multi`.
> If you used the old package name, switch to `codex-multi-auth`.

## Quick Start

### 1. Install

```bash
npx -y codex-multi-auth@latest
```

### 2. Authenticate

```bash
opencode auth login
```

Run `opencode auth login` again to add more accounts (up to 20).

### 3. Use a model

```bash
opencode run "Hello" --model=openai/gpt-5.2 --variant=medium
```

### 4. Verify tools

```text
codex-list
codex-status
```

## Why this plugin

- Use ChatGPT Plus/Pro OAuth instead of API-key billing for OpenCode usage.
- Multi-account failover with health-aware rotation.
- Codex CLI source-of-truth sync (`~/.codex/accounts.json`) by default.
- Built-in account management tools (`codex-*`).
- Strict request shaping for compatibility with the ChatGPT Codex backend.

## Usage Notice

> [!CAUTION]
> Personal development tool.
>
> Not for:
> - commercial API resale
> - multi-tenant production services
>
> You are responsible for compliance with OpenAI Terms of Use.
>
> Official production path: [OpenAI Platform API](https://platform.openai.com/)

## Navigation

- [Installation Options](#installation-options)
- [Model Setup](#model-setup)
- [Account Rotation](#account-rotation)
- [Tool Reference](#tool-reference)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Repository and Docs Map](#repository-and-docs-map)
- [Development](#development)
- [Compatibility](#compatibility)

## Installation Options

### Option A: one-command installer (recommended)

```bash
npx -y codex-multi-auth@latest
```

This installer:
- updates `~/.config/opencode/opencode.json`
- backs up existing config
- clears plugin cache

Use `--legacy` for older OpenCode versions (`<= v1.0.209`).

### Option B: manual setup

Add plugin in `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["codex-multi-auth@latest"]
}
```

Then authenticate:

```bash
opencode auth login
```

### Option C: copy-paste prompt for another agent

```text
Install the codex-multi-auth plugin and configure OpenCode using:
https://raw.githubusercontent.com/ndycode/codex-multi-auth/main/README.md
```

## Model Setup

### Supported model families

| Model | Variants | Notes |
|---|---|---|
| `gpt-5.2` | none, low, medium, high, xhigh | Main general model |
| `gpt-5-codex` | low, medium, high | Main coding model |
| `gpt-5.1-codex-max` | low, medium, high, xhigh | Max-context coding |
| `gpt-5.1-codex` | low, medium, high | Standard coding |
| `gpt-5.1-codex-mini` | medium, high | Smaller coding model |
| `gpt-5.1` | none, low, medium, high | General model |
| `gpt-5.3-codex-spark` | low, medium, high, xhigh | Optional, entitlement-gated |

### Variant usage

```bash
# modern OpenCode (v1.0.210+)
opencode run "Hello" --model=openai/gpt-5.2 --variant=high

# legacy OpenCode (v1.0.209 and below)
opencode run "Hello" --model=openai/gpt-5.2-high
```

### Config templates

Use these ready files:

- `config/opencode-modern.json` (modern variant format)
- `config/opencode-legacy.json` (legacy model-name format)
- `config/minimal-opencode.json` (minimal baseline)

Details: [config/README.md](config/README.md)

## Account Rotation

- Rotation is health-aware and quota-aware.
- Token bucket prevents repeatedly hitting exhausted accounts.
- All-accounts-limited flow can wait/retry with countdown.
- Failed auth can degrade/remove unhealthy accounts.
- Active account writes back to Codex CLI on:
  - explicit selection (`codex-switch`)
  - successful routed requests

Canonical state paths:

- Codex CLI source of truth: `~/.codex/accounts.json`
- Plugin runtime metadata mirror: `~/.opencode/openai-codex-accounts.json`
- Plugin config: `~/.opencode/codex-multi-auth-config.json`

## Tool Reference

### Default tools

| Tool | Purpose | Example |
|---|---|---|
| `codex-list` | list configured accounts | `codex-list` |
| `codex-switch` | switch active account | `codex-switch index=2` |
| `codex-status` | show health/limits/reset timing | `codex-status` |
| `codex-health` | validate token health (read-only) | `codex-health` |
| `hashline_read` | read hashline refs for deterministic edits | `hashline_read path="src/file.ts"` |
| `edit` | hashline-capable edit tool (also supports legacy `oldString/newString`) | `edit path="src/file.ts" lineRef="L42#..." operation="replace" content="..."` |

### Advanced tools (opt-in)

Enable advanced tools:

```bash
CODEX_MULTI_AUTH_EXPOSE_ADMIN_TOOLS=1 opencode
```

| Tool | Purpose | Example |
|---|---|---|
| `codex-metrics` | show process runtime metrics | `codex-metrics` |
| `codex-refresh` | refresh and persist account tokens | `codex-refresh` |
| `codex-remove` | remove account by index | `codex-remove index=3` |
| `codex-export` | export accounts to JSON | `codex-export path="~/backup/accounts.json"` |
| `codex-import` | import/merge accounts from JSON | `codex-import path="~/backup/accounts.json"` |

### Hashline flow (plain OpenCode)

```text
hashline_read path="src/file.ts"
edit path="src/file.ts" lineRef="L42#deadbeef" operation="replace" content="new code"
edit path="src/file.ts" lineRef="L42#deadbeef" endLineRef="L44#feedcafe" operation="replace" content="replacement block"
# legacy fallback remains supported:
edit path="src/file.ts" oldString="from" newString="to"
```

## Configuration

Create optional file:

`~/.opencode/codex-multi-auth-config.json`

### Important options

| Option | Default | Effect |
|---|---|---|
| `codexMode` | `true` | use Codex bridge prompt |
| `codexTuiV2` | `true` | codex-style terminal UI |
| `fastSession` | `false` | lower-latency tuning |
| `fastSessionStrategy` | `hybrid` | `hybrid` or `always` |
| `retryAllAccountsRateLimited` | `true` | wait/retry when all accounts are limited |
| `unsupportedCodexPolicy` | `strict` | strict or fallback for unsupported model responses |
| `unsupportedCodexFallbackChain` | `{}` | model-specific fallback sequence override |
| `fetchTimeoutMs` | `60000` | upstream request timeout |
| `streamStallTimeoutMs` | `45000` | stall timeout for non-stream parsing |

### Common environment variables

```bash
DEBUG_CODEX_PLUGIN=1 opencode
ENABLE_PLUGIN_REQUEST_LOGGING=1 opencode
CODEX_PLUGIN_LOG_BODIES=1 opencode
CODEX_PLUGIN_LOG_LEVEL=debug opencode

CODEX_MODE=0 opencode
CODEX_TUI_V2=0 opencode
CODEX_TUI_COLOR_PROFILE=ansi16 opencode
CODEX_TUI_GLYPHS=unicode opencode

CODEX_AUTH_FAST_SESSION=1 opencode
CODEX_AUTH_FAST_SESSION_STRATEGY=always opencode
CODEX_AUTH_FAST_SESSION_MAX_INPUT_ITEMS=24 opencode

CODEX_AUTH_UNSUPPORTED_MODEL_POLICY=fallback opencode
CODEX_MULTI_AUTH_SYNC_CODEX_CLI=0 opencode
CODEX_MULTI_AUTH_EXPOSE_ADMIN_TOOLS=1 opencode
CODEX_AUTH_FETCH_TIMEOUT_MS=120000 opencode
CODEX_AUTH_STREAM_STALL_TIMEOUT_MS=60000 opencode
```

Full config details: [docs/configuration.md](docs/configuration.md)

## Troubleshooting

Quick reset path:

1. delete `~/.opencode/auth/openai.json`
2. run `opencode auth login`
3. run `codex-status`

### Key file paths (all platforms)

| File | Path |
|---|---|
| OpenCode config | `~/.config/opencode/opencode.json` |
| Auth tokens | `~/.opencode/auth/openai.json` |
| Codex CLI accounts | `~/.codex/accounts.json` |
| Plugin account mirror | `~/.opencode/openai-codex-accounts.json` |
| Plugin config | `~/.opencode/codex-multi-auth-config.json` |
| Plugin logs | `~/.opencode/logs/codex-plugin/` |

More diagnostics: [docs/troubleshooting.md](docs/troubleshooting.md)

## Repository and Docs Map

### Repository ownership

| Path | Responsibility |
|---|---|
| `index.ts` | plugin entrypoint and routing |
| `lib/auth/` | OAuth + token lifecycle |
| `lib/request/` | request transform + fetch + SSE handling |
| `lib/prompts/` | prompt bridge and prompt sync logic |
| `lib/storage/` | paths and migrations |
| `lib/codex-cli/` | Codex CLI state sync |
| `test/` | unit/integration/property tests |
| `scripts/` | build/install helpers |
| `config/` | user config templates |
| `docs/` | user + developer docs |
| `dist/` | generated output |

### AGENTS hierarchy

- `AGENTS.md` applies repo-wide.
- `lib/AGENTS.md` applies to `lib/**`.
- `test/AGENTS.md` applies to `test/**`.

### Docs entry points

- [docs/README.md](docs/README.md)
- [docs/development/REPOSITORY_SCOPE.md](docs/development/REPOSITORY_SCOPE.md)
- [docs/development/ARCHITECTURE.md](docs/development/ARCHITECTURE.md)
- [docs/development/TESTING.md](docs/development/TESTING.md)
- [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)

## Development

```bash
npm run build
npm run typecheck
npm run lint
npm test
```

## Compatibility

- Works with `oh-my-opencode`.
- With `@tarquinen/opencode-dcp`, list `codex-multi-auth` first in plugin order.
- You do not need `openai-codex-auth` alongside this plugin.

## Security and Legal

- Security policy: [SECURITY.md](SECURITY.md)
- This project is independent and not affiliated with OpenAI.
- "ChatGPT", "GPT-5", "Codex", and "OpenAI" are trademarks of OpenAI, L.L.C.

## Credits

- [numman-ali/opencode-openai-codex-auth](https://github.com/numman-ali/opencode-openai-codex-auth) by [numman-ali](https://github.com/numman-ali)
- [ndycode](https://github.com/ndycode)

## License

MIT. See [LICENSE](LICENSE).