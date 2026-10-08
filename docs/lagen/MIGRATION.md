# LAGEN migration status

Source: [mindorigin150/lagen at 5e95bfd](https://github.com/mindorigin150/lagen/tree/5e95bfd).
Destination: https://ragen-ai.github.io/lagen/.

- Implementation: source and media migrated into the shared Astro site.
- Local verification (2026-10-08): complete. The shared Astro build passes.
  All 109 public assets, numerical data, styles and fonts match the source.
  Desktop checks cover all 72 delay choices. Phone checks cover six endpoint
  choices. Layout metrics match the original at 1920px and 390px. Navigation,
  clipboard, playback, chart controls and all three menus pass.
- TypeScript: the migrated LAGEN scripts pass. The repository-wide check reports
  two existing missing Node type errors in the unchanged `astro.config.mjs`.
- Publication: pending pull request merge and Pages deployment.
- Previous site: remains live until the new site passes online verification.

LAGEN is maintained in this repository. RAGEN-2, BAGEN and RAGEN V1 link to it
from their More Research menus. Historical source and experiment evidence
remain in their original repositories and artifacts.
