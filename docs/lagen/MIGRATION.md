# LAGEN migration status

Source: `mindorigin150/lagen@5e95bfd` (private archive).
Public migration: [PR #1](https://github.com/RAGEN-AI/ragen-ai.github.io/pull/1).
Destination: https://ragen-ai.github.io/lagen/.

- Implementation: source and media migrated into the shared Astro site.
- Local verification (2026-10-08): complete. The shared Astro build passes.
  All 109 public assets, numerical data and fonts match the source.
  Desktop checks cover all 72 delay choices. Phone checks cover six endpoint
  choices. Layout metrics match the original at 1920px and 390px. Navigation,
  clipboard, playback, chart controls and all three menus pass.
- TypeScript: the migrated LAGEN scripts pass. The repository-wide check reports
  two existing missing Node type errors in the unchanged `astro.config.mjs`.
- Publication: complete. [Pages deployment](https://github.com/RAGEN-AI/ragen-ai.github.io/actions/runs/37753976914)
  succeeded for merge revision `fda4082235be049e8edd4f29a2b65c4022766afc`.
- Online verification: complete. All 109 public assets return HTTP 200 and match
  the local file lengths. Desktop checks cover the delay endpoints of all twelve
  tasks. Phone checks cover six endpoints. Menus pass at desktop and phone sizes.
- Footer: centered copyright and maintenance notices link to MLL Lab. Desktop
  and phone screenshots were inspected. Text remains 16px without page overflow.
- Pages source: legacy publishing from `main` is still enabled. An administrator
  must set Settings → Pages → Source to GitHub Actions to stop the built-in
  publisher from competing with the Astro deployment.
- Previous site: Pages deleted, deployment workflow disabled, repository private.
  The private repository preserves the previous source and history.

LAGEN is maintained in this repository. RAGEN-2, BAGEN and RAGEN V1 link to it
from their More Research menus. Historical source and experiment evidence
remain in their original repositories and artifacts.
