# Local distributable verification — 2026-10-24

Owner authorized a local build/package test, **not publication or deployment**. Built from source commit `daebb95d2114b9219ff5efb0946865382a43393c` in a clean, separate worktree; removed generated output directories before extraction, Vite 8 production bundling and MCP compilation. No source aliases or simulated package manifests were used in the consumers.

## Current security baseline — October 2026

The [October 21 Node security advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) includes high-severity DNS/TLS flaws and the Brotli decoder out-of-bounds write (CVE-2026-111497), which can permit code execution when untrusted compressed input is decoded. Fixed supported releases are **22.23.4, 24.22.1 and 26.12.1**. A clean npm audit does not audit the running Node binary or its bundled Brotli/OpenSSL/Undici/CA data.

Both manifests now declare **`^22.23.4 || ^24.22.1 || ^26.12.1`**. `.node-version` selects 22.23.4 for runtime managers, root `.npmrc` makes installs engine-strict, and MCP checks the actual runtime before creating tools. Unit checks reject pre-fix patches, EOL odd-numbered lines, prereleases and unreviewed future majors. Vue `^3.3.0` remains unchanged.

The earlier **22.0.0** run below proved compatibility only, **not security**; it is now intentionally unsupported. The former `>=22` range also admitted vulnerable **26.9.0**, which was still the machine's default during this audit. Project pins/engines do not replace that installation or patch running processes: a host upgrade plus restart of Node-based clients/agents is required. This PR does not claim to fix an already-running host process or certify absence of compromise.

All new validation uses checksum-verified isolated **22.23.4 / 24.22.1 / 26.12.1** binaries from nodejs.org, never the vulnerable default binary. **55 source tests**, lint, source/consumer/site/MCP typechecks and source stdio pass. The full installed-tarball suite passes under all three patched hosts, each with Vue 3.3.0 and 3.5.44; every installed CLI is also tested through all three Node binaries. A negative compiled-entry check simulates version 26.9.0 on a patched interpreter and confirms refusal before protocol startup, without running an exploit or an actually vulnerable binary. Root/MCP lockfile audits show zero findings in full and production views at this snapshot. See the implementing PR for exact final tree, tarball checksum and patched-runtime results. No exploit payloads are run and no publication/deployment occurs. These floors address the current advisory snapshot, not future vulnerabilities; continue following supported-line security updates.

## Historical Node 22 follow-up

The owner-approved runtime policy now requires **Node `>=22` in both root and MCP manifests/lockfiles**; the root package ships the CLI. Node 18/20 are no longer claimed. Use a patched supported LTS release; repository development requires Node **22.12+**. Vue peer `^3.3.0` and SDK v1 are unchanged. This is an unreleased breaking runtime requirement, not a change to registry 0.8.3.

A fresh build/pack passed the complete installed-tarball suite under **Node 22.23.4 and 26.12.1**, each with Vue 3.3.0 and 3.5.44. Installs used `--engine-strict`. In every host the installed CLI passed all three tools, six reference lookups and invalid-input rejection using actual Node binaries **22.0.0, 22.23.4 and 26.12.1**. The 22.0.0 run checks the declared CLI floor only, not the development toolchain; it is not a recommendation to run an unpatched initial release. Runtime archives were fetched from nodejs.org and SHA-256 checked against its published SHASUMS256 files. Node 22 source lint/typechecks, all **52 tests**, source stdio and reference freshness passed; both build lockfiles audited zero findings in full and production views. The final committed-tree tarball checksum and provenance are recorded in the implementing PR.

The earlier Node 18 mismatch below is resolved by this explicit policy change, not by downgrading/pinning the SDK's adapter. No UI runtime or public Vue API changed.

## Earlier exact local artifact

- File: `littlebrand-ui-kit-0.8.3.tgz` (138 entries, 245,939 bytes).
- SHA-256: `2262ce1bfc48eeab8b5f13360666fe5b51a1cfd2c5c63c874e6fe687412c4358`.
- This is a **new local unreleased artifact**, not registry npm 0.8.3.
- Both build lockfiles audited zero findings at this snapshot; dependency ranges in a fresh consumer can resolve differently from the build lockfiles.

| Check against installed tarball | Vue 3.3.0 | Vue 3.5.44 |
| --- | --- | --- |
| ESM and CommonJS root imports; matching named exports; CSS path | Pass | Pass |
| Strict Bundler + NodeNext declarations, `skipLibCheck=false` | Pass | Pass |
| Strict Vue SFC consumer (TypeScript 6.0.3) | Pass | Pass |
| Consumer production build using Vite 8.3.5 | Pass | Pass |
| Chromium production preview, light/dark, all six packaged reference examples | Pass | Pass |
| Installed `littlebrand-mcp` bin: three tools, six exact lookups, invalid-input rejection | Pass | Pass |

Interactions cover save feedback, email and notes controls, one-save-per-click/Enter form submission, radio-group arrows, Dialog name/focus/Escape/body-scroll restoration, computed CSS theme changes and runtime brand customization. This is targeted evidence, not a complete component/accessibility certification. Runtime used: Node **26.9.0**; browser orchestration: Playwright **1.64.1**.

## Build-related correction

The authorized extraction now emits authored, tested SFCs for the seven verified component records (six intents, including the compound SegmentButton item). Old tests expected legacy snippets even after extraction and therefore failed. Refreshed the generated component source records and changed the checks to require exact equality with the authored examples, while retaining the five known failures outside the verified slice and the validator's deliberate-invalid-input test. No captured agent answer was edited. Token record differences were order/timestamp-only and were not committed; generated compiled MCP output is kept in the local tarball, not checked in by this verification PR.

## Reproduce

After an explicitly authorized fresh build and local pack, run from the repo with its test dependencies installed:

```sh
LB_TARBALL=/absolute/path/littlebrand-ui-kit-0.8.3.tgz \
LB_REPORT=/absolute/path/verification.json \
node tests/verify-distributable.mjs
```

The verifier creates and removes independent temporary npm consumers, requires both installed manifests to match the repo's security-patched Node range, installs pinned test tools with `--engine-strict --ignore-scripts --include=dev`, and tests production output. Optional `LB_MCP_NODE_BINARIES` is a JSON array of absolute Node executable paths; it runs the installed CLI through each binary and records the observed versions in the report. Without it, the CLI uses the verifier's current Node executable. It never builds/extracts the kit, publishes, or deploys. `LB_KEEP_CONSUMERS=1` retains consumers for debugging. The supplied tarball's checksum and observed results are written to `LB_REPORT`, if set.

## Remaining boundaries

- Published npm 0.8.3 and tracked old MCP `dist/` remain unchanged. A future version/commit needs its own fresh artifact check.
- **Historical findings, superseded above:** Node 18/20 are no longer supported, and the broad `>=22` policy was subsequently tightened to patched 22/24/26 lines. Historical compatibility checks on old patches are not security clearance.
- Vue 3.3.0 is a historical compatibility host, not a recommendation to use unpatched old framework versions.
- Real iOS Safari/Firefox, screen readers, every component's API semantics, and a published release are not certified.
