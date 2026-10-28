# LittleBrand verified-slice docs preview

A separate Vue + Vite **source-only** site for the Step 09 reference. This is not the existing development showcase, not a published website, and not an npm artifact. No hosting/deployment framework or URL is promised.

From the repository root:

```sh
npm run reference:check
npm run dev:site
npm run typecheck:site
npm run test:site
```

`dev:site` serves only the local docs preview. It imports the verified public components from source and displays the *same* versioned `reference/v1.json` that generates the machine reference, component/token Markdown, and compact AI index. Markdown is copied by `npm run reference:generate` into `site/public/reference/v1/` and checked for drift by `npm run reference:check`. Do not edit generated site Markdown by hand.

The six previews exercise Button, Input, Textarea, FormField, Dialog, and compound SegmentButton; SegmentButtonItem is only used inside its parent. The UI offers purpose/use/avoid/a11y guidance, API, copyable tested Vue code, a small semantic token browser, system/light/dark and custom palette switches, and the npm root/CSS install path. The **MCP guide** section walks through connecting this checkout's unreleased source server, searching the public source-export catalog by intent, retrieving a verified example, and recognizing catalog-only results without checked APIs. The source walkthrough is separate from the installed 0.9.0 CLI; the earlier 0.8.3 server has different tools. Browser checks use local Vite + Chromium without a production build. See [Step 11 limits](../docs/STEP_11_DOC_SITE.md) before treating this as a release or deployment.
