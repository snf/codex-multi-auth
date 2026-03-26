# Architecture Review

Opinionated architecture review of the authored code in this repository.

Scope:
- Reviewed first-party code in `index.ts`, `lib/**`, `scripts/**`, `test/**`, and repository docs.
- Treated `dist/` as generated output and `vendor/` as vendored dependencies rather than primary architecture ownership.

## Executive Summary

This repository is more mature than its size suggests. The code is strongest where failure is most expensive: OAuth edge cases, account rotation, storage durability, worktree identity, Windows filesystem behavior, and compatibility with upstream Codex behavior. The author has clearly operated this tool in real conditions and encoded that experience into the implementation.

The main weakness is not correctness. It is composition.

The system behaves like a robust product, but its core is still organized like a successful prototype that kept absorbing features. The most important logic is concentrated in a few large orchestration files:

| File | Approx. size | Architectural role |
| --- | ---: | --- |
| `index.ts` | 4,059 lines | plugin runtime, request loop, tool registration, lifecycle |
| `lib/codex-manager.ts` | 3,272 lines | CLI command router, dashboard orchestration, auth flows |
| `lib/codex-manager/repair-commands.ts` | 2,196 lines | repair/doctor/fix workflows |
| `lib/storage.ts` | 1,918 lines | storage facade, migration, backup, restore, dedupe |
| `lib/config.ts` | 1,596 lines | config loading, env override resolution, getters, explain report |
| `lib/request/fetch-helpers.ts` | 1,249 lines | fetch pipeline helpers, model fallback, proxy/header handling |
| `lib/request/request-transformer.ts` | 1,132 lines | request normalization and prompt/tool shaping |

Overall verdict:
- Reliability and operational thinking: strong
- Test discipline: strong
- Modularity at the center of the system: mixed
- Long-term maintainability: good, but becoming expensive

## Repository Shape

The repo is effectively four products sharing one codebase:

1. `scripts/codex.js` and related wrappers
   This is the CLI interception layer. It decides whether a command stays local as `codex auth ...` or gets forwarded to the official `@openai/codex` binary.

2. `lib/codex-manager.ts` plus `lib/codex-manager/**`
   This is the account-management application: login, switch, status, health, forecast, report, repair, and interactive settings/dashboard flows.

3. `index.ts` plus `lib/request/**`, `lib/runtime/**`, `lib/accounts.ts`, `lib/auth/**`
   This is the plugin runtime that intercepts SDK requests and routes them through the ChatGPT Codex backend with multi-account selection, refresh, retry, and failover.

4. `lib/storage.ts` plus `lib/storage/**`, `lib/unified-settings.ts`, `lib/config.ts`
   This is the persistence and compatibility substrate: project/global account pools, migrations, backups, flagged accounts, settings, and worktree-aware path resolution.

Tests are not an afterthought. They are a major architectural component. The repository contains more test code than source code, including property tests, chaos tests, documentation integrity tests, and platform-specific filesystem edge cases.

## System Model

```text
User / host runtime
  |
  +--> scripts/codex.js
  |      |
  |      +--> local auth commands -> lib/codex-manager.ts -> lib/auth + lib/storage + lib/ui
  |      |
  |      +--> non-auth commands -> official @openai/codex CLI
  |
  +--> index.ts plugin runtime
         |
         +--> lib/config.ts
         +--> lib/storage.ts / lib/storage/**
         +--> lib/accounts.ts / lib/rotation.ts
         +--> lib/auth/**
         +--> lib/request/**
         +--> lib/runtime/**
         +--> lib/prompts/**
         |
         +--> ChatGPT Codex backend
```

The architectural center is a shared account/state model used by both the CLI-management path and the plugin request-interception path.

## Main Subsystems

| Subsystem | Key files | Notes |
| --- | --- | --- |
| CLI wrapper | `scripts/codex.js`, `scripts/codex-routing.js` | Keeps `codex auth ...` local and forwards everything else |
| Plugin entry | `index.ts` | Runtime lifecycle, loader setup, fetch loop, tool registration |
| Auth | `lib/auth/auth.ts`, `lib/auth/server.ts`, `lib/auth/browser.ts` | OAuth PKCE, callback capture, browser/manual flows |
| Account pool | `lib/accounts.ts`, `lib/rotation.ts`, `lib/health.ts`, `lib/circuit-breaker.ts` | Health scoring, token bucket, cooldowns, selection |
| Request transformation | `lib/request/request-transformer.ts`, `lib/request/helpers/*` | Model normalization, prompt injection, tool filtering, fast-session trimming |
| Fetch/error handling | `lib/request/fetch-helpers.ts`, `lib/request/failure-policy.ts`, `lib/request/stream-failover.ts`, `lib/request/response-handler.ts` | Headers, retries, rate limits, SSE parsing, failover |
| Runtime adapters | `lib/runtime/**` | Small adapters extracted from `index.ts` to isolate state transitions and setup concerns |
| Storage | `lib/storage.ts`, `lib/storage/**` | Account files, migrations, backups, restore, flagged accounts, transactions |
| Worktree identity | `lib/storage/paths.ts` | One of the most careful modules in the repo; validates linked-worktree identity and path safety |
| Settings/config | `lib/config.ts`, `lib/unified-settings.ts`, `lib/dashboard-settings.ts` | Defaulting, env precedence, persisted settings, explainability |
| CLI state bridge | `lib/codex-cli/**` | Synchronizes compatibility state with the official Codex CLI |
| UI/TUI | `lib/ui/**`, `lib/codex-manager/settings-hub.ts` | ANSI UI primitives, menu/select logic, dashboard settings |

## Primary Runtime Flows

### 1. CLI command flow

`scripts/codex.js` is a dispatch shim:

- `codex auth ...` stays inside this repo
- everything else is forwarded to the official Codex CLI
- startup may auto-sync active account selection back into Codex CLI state

This is a good boundary. It keeps the wrapper minimally invasive and avoids forking the whole official CLI surface.

### 2. OAuth and account onboarding

The auth path is conventional in the right ways:

- PKCE OAuth flow in `lib/auth/auth.ts`
- local callback server on port `1455` in `lib/auth/server.ts`
- browser-open and manual fallback support
- token-derived identity extraction in `lib/auth/token-utils.ts`

This area looks careful rather than clever, which is the correct choice.

### 3. Plugin request flow

The plugin path in `index.ts` does roughly this:

1. Load effective plugin config.
2. Apply storage scope and runtime toggles.
3. Ensure live-sync/session-affinity/refresh-guardian services.
4. Normalize request body and rewrite it for Codex compatibility.
5. Choose an account using availability, affinity, cooldown, quota, and capability signals.
6. Refresh tokens if needed.
7. Execute the request with timeout, same-account retry, cross-account failover, and unsupported-model fallback handling.
8. Convert SSE streams into compatibility JSON when needed.
9. Update account health, quota/rate-limit state, affinity, and persistence.

The behavior is sophisticated. The problem is that too much of this flow is still hosted in one file.

### 4. Storage and recovery flow

Storage is a first-class subsystem, not a JSON dump:

- project-scoped and global pools
- worktree identity resolution
- migration from legacy formats
- backup/WAL/restore mechanics
- flagged-account side channel
- queued writes and retry logic for flaky filesystems

This is one of the strongest parts of the codebase.

## What The Code Does Well

### Operational paranoia

This repository is unusually attentive to real-world failure modes:

- Windows `EBUSY` / `EPERM` / `ENOTEMPTY` handling
- linked-worktree identity validation
- stale-while-revalidate prompt caching
- token refresh race prevention
- cooldown and circuit-breaker behavior
- quota-aware scheduling and preemptive deferral
- structured storage recovery paths

That is not cosmetic engineering. It is expensive, high-value engineering.

### Testing breadth

The test suite is a real asset:

- more test code than source code
- property-based tests for rotation and transformer behavior
- chaos/fault-injection coverage
- documentation integrity tests
- path and filesystem edge-case tests
- command and UI workflow tests

This gives the repository more change safety than many projects with cleaner architecture.

### Progressive extraction

The code is not static monolith code. There is visible extraction work already underway:

- `lib/runtime/**` has peeled state-setup helpers out of `index.ts`
- `lib/storage/**` has peeled pathing, backup, import/export, and transaction logic out of `lib/storage.ts`
- `lib/codex-manager/commands/**` and related settings modules show similar decomposition

The architecture is moving in the right direction.

## Where The Architecture Is Weak

### 1. Orchestration is too centralized

`index.ts` is carrying too many responsibilities:

- runtime lifecycle
- configuration hydration
- service initialization
- account reload/cache logic
- request transformation
- selection/failover loop
- metrics
- tool registration

That makes reasoning about changes harder than it should be, even if the code is tested.

`lib/codex-manager.ts` has the same problem on the CLI side.

### 2. Config has become a manual registry

`lib/config.ts` is functional, but it is too large and too repetitive. The pattern of:

- default field
- env override
- getter
- explain entry
- docs/tests parity

is mostly encoded by hand. That raises maintenance cost and increases drift risk.

### 3. There is visible duplication from extraction-by-copy

A few files show near-duplicate helper trees:

- `lib/runtime/request-init.ts` and `lib/request/request-init.ts`
- `lib/runtime/account-state.ts` and `lib/runtime/account-status.ts`
- `lib/runtime/metrics.ts` duplicates small helpers now also present in request modules

This is not catastrophic, but it is a signal that extraction is happening faster than consolidation.

### 4. Coverage policy is weaker than the test volume suggests

The repository has many tests, but the coverage gate excludes several high-risk areas:

- `index.ts`
- `lib/codex-manager.ts`
- `lib/ui/**`
- `lib/tools/**`
- `scripts/**`

That excludes roughly a quarter of authored runtime/script code from the threshold. The code is still tested, but the coverage percentage overstates how much of the most behavior-dense code is actually enforced by the gate.

### 5. Public boundary management is loose

`lib/index.ts` re-exports a wide surface area. Combined with the compatibility promises in `docs/reference/public-api.md`, this makes internal refactoring more expensive than it needs to be. The architecture would benefit from a narrower stable API and a more deliberate internal-only layer.

### 6. Documentation has some source-of-truth drift

The repo has strong documentation discipline overall, but there are signs of drift:

- multiple architecture documents with overlapping scope
- stale size descriptions in some internal docs
- `docs/reference/public-api.md` still mentions a `0.x` line while `package.json` is `1.2.1`

That is not a runtime bug, but it is an architecture-governance smell.

## Improvement Opportunities

### Highest value

1. Split `index.ts` into explicit application services.
   Recommended seams:
   - `PluginRuntimeBootstrap`
   - `RequestExecutionCoordinator`
   - `AccountFailoverExecutor`
   - `AdminToolRegistry`
   - `RuntimeMetricsService`

2. Do the same for `lib/codex-manager.ts`.
   The command router should not also own large interactive flows, quota formatting, OAuth prompting, and persistence choreography.

3. Replace config getter sprawl with a declarative config registry.
   Each setting should live in one schema entry with:
   - key
   - type
   - default
   - env names
   - validation
   - explain metadata
   - persistence behavior

4. Merge duplicate runtime/request helpers.
   A small shared internal utility layer would remove the current copy-and-tweak pattern.

5. Tighten the coverage contract around orchestration code.
   The best target is not blanket 100%. It is bringing the excluded high-complexity files under at least a smoke-level coverage threshold.

### Medium value

6. Narrow the public export barrel.
   Keep stable package entrypoints, but stop treating most deep helpers as compatibility surface unless they are intentionally public.

7. Separate policy from mechanism more aggressively.
   Examples:
   - failover rules as pure policy modules
   - account selection scoring as pure composable strategy
   - tool exposure policy outside `index.ts`

8. Consolidate docs around one architecture source of truth.
   The repo can keep both a public and a maintainer view, but one should clearly derive from the other.

## Recommended Direction

The right next step is not a rewrite.

This codebase already contains the hard-won behavior. The architecture should preserve that behavior while shrinking the coordinator files and reducing duplicate helper layers. In other words: keep the operational knowledge, change the packaging.

If I had to summarize the codebase in one sentence:

> strong systems engineering wrapped in a still-too-centralized application structure

That is a good place to be, because centralization is painful but fixable. Missing operational rigor is much harder to recover later.
