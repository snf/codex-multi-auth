# Security Audit Report

Date: 2026-03-26
Repository: `/projects/codex-multi-auth`
Scope: Static review of code, wrapper behavior, vendored artifacts, and dependency supply-chain signals

## Executive Summary

I did not find an obvious hidden code-execution backdoor such as obfuscated payloads, `eval`, `vm`, hidden binaries, or covert network exfiltration logic.

I did find multiple material security issues and trust-boundary risks:

1. High: Runtime remote prompt supply chain can change agent behavior without a package release.
2. Medium: Windows wrapper installs persistent command/profile hooks automatically.
3. Medium: Vendored dependency provenance verification is broken; local shim integrity cannot be trusted from the manifest.
4. Medium: Dependency tree contains unresolved advisories, including one production dependency.
5. Low: Release hygiene inconsistencies reduce reproducibility and audit confidence.

## Findings

### 1. High: Runtime Remote Prompt Supply Chain

What happens:
- The package fetches instruction and prompt text from the network at runtime.
- That fetched text is then injected into outgoing model requests or used to decide which host prompts to strip.

Why this matters:
- A compromised upstream repo, maintainer account, release artifact, or allowed override URL could silently change agent behavior.
- This can influence tool use, file edits, command execution, and safety instructions without a new `codex-multi-auth` release.

Evidence:
- [lib/prompts/codex.ts](/projects/codex-multi-auth/lib/prompts/codex.ts#L110) fetches the latest `openai/codex` GitHub release tag.
- [lib/prompts/codex.ts](/projects/codex-multi-auth/lib/prompts/codex.ts#L279) downloads prompt files from `raw.githubusercontent.com/openai/codex/...`.
- [lib/request/fetch-helpers.ts](/projects/codex-multi-auth/lib/request/fetch-helpers.ts#L710) loads these instructions during request transformation.
- [lib/request/request-transformer.ts](/projects/codex-multi-auth/lib/request/request-transformer.ts#L1007) assigns them to `body.instructions`.
- [lib/prompts/host-codex-prompt.ts](/projects/codex-multi-auth/lib/prompts/host-codex-prompt.ts#L14) also trusts third-party prompt sources by default:
  - `anomalyco/Codex`
  - `sst/Codex`
- [lib/prompts/host-codex-prompt.ts](/projects/codex-multi-auth/lib/prompts/host-codex-prompt.ts#L199) additionally allows `CODEX_PROMPT_SOURCE_URL`.
- [lib/request/request-transformer.ts](/projects/codex-multi-auth/lib/request/request-transformer.ts#L792) uses that fetched prompt in host-prompt filtering.
- [lib/request/helpers/input-utils.ts](/projects/codex-multi-auth/lib/request/helpers/input-utils.ts#L60) compares live-fetched prompt content against incoming system/developer prompts to remove them.

Risk assessment:
- Official `openai/codex` fetching is already a supply-chain risk because content is not pinned by commit hash or signature.
- The third-party and env-override host prompt sources are more concerning because they expand trust beyond OpenAI and permit arbitrary remote substitution.

Recommended remediation:
- Vendor known-good prompt files in-repo.
- If remote refresh is required, pin exact commit SHAs or signed release assets and verify hashes before use.
- Remove or heavily restrict `CODEX_PROMPT_SOURCE_URL`.
- Do not use third-party repos as default trusted prompt sources.

### 2. Medium: Automatic Windows Persistence via Shim and Profile Rewrites

What happens:
- On Windows, the wrapper rewrites `codex.bat`, `codex.cmd`, `codex.ps1`, and PowerShell profile files to preserve routing through this package.

Why this matters:
- This behaves like persistence and command hijacking.
- It is not hidden in the code, but it modifies user shell behavior outside the immediate execution path.
- In a compromised package scenario, this would make cleanup harder and increase blast radius.

Evidence:
- [scripts/codex.js](/projects/codex-multi-auth/scripts/codex.js#L219) defines Windows shell guard markers.
- [scripts/codex.js](/projects/codex-multi-auth/scripts/codex.js#L270) builds replacement `codex.bat` and `codex.cmd` shims.
- [scripts/codex.js](/projects/codex-multi-auth/scripts/codex.js#L316) builds replacement `codex.ps1`.
- [scripts/codex.js](/projects/codex-multi-auth/scripts/codex.js#L414) builds a PowerShell profile block that defines a global `codex` function.
- [scripts/codex.js](/projects/codex-multi-auth/scripts/codex.js#L482) applies these changes automatically at startup.

Risk assessment:
- This is an explicit persistence mechanism.
- It may be intended for reliability, but from a defensive review perspective it is high-friction behavior that should be opt-in, not default.

Recommended remediation:
- Make shell/profile modifications explicit opt-in.
- Require a dedicated install command and clear user confirmation.
- Add a paired uninstall/rollback command.

### 3. Medium: Vendored Dependency Provenance Verification Fails

What happens:
- The repo contains vendored `@codex-ai/plugin` and `@codex-ai/sdk` shims plus a provenance manifest.
- The manifest hashes do not match the files on disk.

Why this matters:
- The repository’s own integrity mechanism cannot currently establish trust in those vendored artifacts.
- Even though the shim contents are small and not obviously malicious, the broken verification means tampering would not be distinguishable from packaging drift without deeper manual review.

Evidence:
- [vendor/provenance.json](/projects/codex-multi-auth/vendor/provenance.json#L1) defines expected SHA-256 hashes.
- [scripts/verify-vendor-provenance.mjs](/projects/codex-multi-auth/scripts/verify-vendor-provenance.mjs#L1) enforces those hashes.
- `npm run vendor:verify` fails.
- Manual hash verification showed mismatches for every listed vendored file, not just one.

Observed command result:
```text
Error: Vendor provenance mismatch for vendor/codex-ai-plugin/package.json: expected b4dda9e..., got d5f72e9...
```

Additional note:
- The vendored files themselves are minimal:
  - [vendor/codex-ai-plugin/dist/index.js](/projects/codex-multi-auth/vendor/codex-ai-plugin/dist/index.js)
  - [vendor/codex-ai-plugin/dist/tool.js](/projects/codex-multi-auth/vendor/codex-ai-plugin/dist/tool.js)
- I did not find suspicious logic in them.

Recommended remediation:
- Regenerate and recommit `vendor/provenance.json` from known-good source files.
- Add CI gating so a release cannot proceed if `vendor:verify` fails.
- Document the provenance source for the vendored shims.

### 4. Medium: Unresolved Dependency Advisories

What happens:
- `npm audit --json` reported active advisories in the dependency tree.

Why this matters:
- Most are dev-only and likely low exploitability in this repo.
- One production dependency, `hono`, is below the patched range.

Findings:
- `hono` 4.12.6 is vulnerable according to advisory `GHSA-v8w9-8mx6-g223`; patched in 4.12.7+.
- `@openauthjs/openauth` is flagged because it depends on `hono`.
- Dev-only advisories were reported for:
  - `ajv`
  - `flatted`
  - `picomatch`
  - `yaml`

Evidence:
- Direct deps in [package.json](/projects/codex-multi-auth/package.json#L133).
- `npm audit --json` reported 6 vulnerabilities total.
- `npm explain` showed:
  - `ajv` from `eslint`
  - `flatted` from `eslint` and `@vitest/ui`
  - `picomatch` from `lint-staged`, `vite`, `vitest`
  - `yaml` from `lint-staged` and `vite`

Exploitability note:
- I did not find any direct `hono` import in repo code.
- That lowers practical exploitability here, but it does not eliminate the need to update.

Recommended remediation:
- Upgrade `hono` to at least 4.12.9.
- Refresh the lockfile.
- Re-run audit and trim remaining dev-only issues where practical.

### 5. Low: Release Hygiene / Reproducibility Drift

What happens:
- Version metadata is inconsistent between `package.json` and `package-lock.json`.

Evidence:
- [package.json](/projects/codex-multi-auth/package.json#L1) reports version `1.2.1`.
- [package-lock.json](/projects/codex-multi-auth/package-lock.json#L1) reports version `1.2.0`.

Why this matters:
- This is not evidence of compromise by itself.
- It weakens reproducibility and makes supply-chain review less reliable.

Recommended remediation:
- Regenerate and commit the lockfile together with version bumps.
- Add CI to detect version mismatch between package metadata files.

## What I Did Not Find

I did not find:
- `eval`, `new Function`, or `vm` use
- hidden binaries or large opaque blobs
- unexpected downloader logic such as `curl | sh`
- covert exfiltration domains beyond the explicit OpenAI/GitHub/npm/runtime endpoints
- obvious token exfiltration in normal request code

The notable outbound hosts in source were primarily:
- `auth.openai.com`
- `api.openai.com`
- `chatgpt.com`
- `api.github.com`
- `raw.githubusercontent.com`
- `registry.npmjs.org`

## Validation Performed

Commands run:
- `git status --short`
- broad `rg` sweeps for risky APIs, subprocesses, URLs, and encoded payload patterns
- `npm ls --depth=0`
- `npm audit --json`
- `npm run vendor:verify`
- `npm run typecheck`
- `npm explain ajv flatted picomatch yaml`
- `npm view ...` for package metadata and registry provenance context

Results:
- `typecheck` passed
- `vendor:verify` failed
- `npm audit` reported 6 advisories

## Sources

- Hono advisory: https://github.com/advisories/GHSA-v8w9-8mx6-g223
- Ajv advisory: https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
- Flatted advisory: https://github.com/advisories/GHSA-rf6f-7fwh-wjgh
- Picomatch advisory: https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
- YAML advisory: https://github.com/advisories/GHSA-48c2-rrv3-qjmp

## Bottom Line

I did not confirm an intentional backdoor.

I did confirm several high-risk design choices and trust failures that would make a compromise easier to hide or weaponize:
- live remote prompt control
- automatic persistence on Windows
- broken vendored-artifact provenance verification
- unresolved dependency advisories

If this package is being considered for real use, those issues should be fixed before it is trusted.
