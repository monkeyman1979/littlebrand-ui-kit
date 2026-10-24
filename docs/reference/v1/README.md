# LittleBrand verified reference v1

Source: `reference/v1.authored.json`; API derived from implementation and declarations. Package version: `0.8.3`. Unreleased source reference; not a published 0.8.3 artifact.

Vue peer range ^3.3.0. Install from npm; import components from littlebrand-ui-kit and CSS from littlebrand-ui-kit/style.css. This source reference describes unreleased develop work, not the published 0.8.3 artifact. Deep imports are unsupported.

## Components

- [LbButton](./components/LbButton.md) — Trigger an action or navigate to a destination.
- [LbInput](./components/LbInput.md) — Collect one line of text with v-model.
- [LbTextarea](./components/LbTextarea.md) — Collect longer free-form text with v-model.
- [LbFormField](./components/LbFormField.md) — Compose a label, control and one helper or validation message.
- [LbDialog](./components/LbDialog.md) — Present a modal decision or focused content.
- [LbSegmentButton](./components/LbSegmentButton.md) — Choose one or more options from a short set of segments.
- [LbSegmentButtonItem](./components/LbSegmentButtonItem.md) (compound child only) — One option within LbSegmentButton.

## Verified semantic token selection

- [`--lb-fill-primary-normal`](./TOKENS.md#token---lb-fill-primary-normal) — Primary solid control fill; light/dark palette step 9.
- [`--lb-text-on-primary`](./TOKENS.md#token---lb-text-on-primary) — Readable foreground on primary normal fill; contrast anchor chosen per mode/state, not ordinary primary text.
- [`--lb-focus-ring-color`](./TOKENS.md#token---lb-focus-ring-color) — Button focus ring color, resolved from the primary focus border role; width and offset use shared SASS sizing.
- [`--lb-border-neutral-normal`](./TOKENS.md#token---lb-border-neutral-normal) — Neutral control border, palette step 7.
- [`--lb-border-error-normal`](./TOKENS.md#token---lb-border-error-normal) — Error control border, palette step 7.
- [`--lb-text-neutral-normal`](./TOKENS.md#token---lb-text-neutral-normal) — Normal neutral reading text, palette step 11.
- [`--lb-surface-subtle`](./TOKENS.md#token---lb-surface-subtle) — Global background-source subtle layer used by the Dialog panel, separate from family-specific surfaces.
- [`--lb-surface-overlay`](./TOKENS.md#token---lb-surface-overlay) — Dialog backdrop overlay, not a tinted surface step.
- [`--lb-surface-primary-active`](./TOKENS.md#token---lb-surface-primary-active) — Primary tinted selected/pressed surface, palette step 5; not keyboard focus.

Only these authored tokens are listed here; see [Step 02](../../STEP_02_TOKEN_CONTRACT.md) for the complete semantic grammar. Generic extracted MCP examples are not verified: Dialog has no filled variant, and a SegmentButtonItem cannot stand alone.
