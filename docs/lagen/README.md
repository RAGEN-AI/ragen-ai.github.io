# LAGEN project page

Astro research homepage for **LAGEN: Are Vision-Language Agents Latency Aware?**

## Preview and build

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 4321
npm run build
```

Run these commands from the repository root. Preview:
`http://127.0.0.1:4321/lagen/`. The public homepage is
[https://ragen-ai.github.io/lagen/](https://ragen-ai.github.io/lagen/). The shared Astro base stays `/`; LAGEN
uses `/lagen/` for its homepage and static resource URLs. The Pages workflow
publishes the complete site on a push to `main` or manual dispatch.
Local preview and build do not publish the site.

Link previews use `public/lagen/assets/latency-aware-agents-social-card.png`, a 1200×630 browser
render of the hero logo, wordmark and paper title, with the site's Inter font
and colors. `src/lagen/layouts/Layout.astro` supplies the same absolute image URL to
Open Graph and Twitter cards. Use a new image filename when replacing the
cover; sharing platforms can cache both page metadata and image URLs.

## Editing the logo

The homepage uses `public/lagen/assets/logo.svg`. The original `logo.png` remains a
visual reference. The SVG has a transparent background and three independent
groups: `hourglass`, `circuits`, and `wordmark`. All letters are paths, so the
logo does not require a font. Open the SVG in a vector editor or edit its source.

- **Circuit color:** change `stroke="#5F5F5F"` on `circuits`. Its `opacity="1"`
  keeps all circuit lines and rings fully opaque. The shared stroke width is 12
  SVG units; each endpoint circle has radius 16.
- **Hourglass size:** change `scale(1.1)` on `hourglass`. This uniformly scales
  both dimensions to 110% of the drawn paths. The first translation places its
  center at `(476, 363.1)` so its bottom stays above the letters. Keep both
  translations to scale around this center. After resizing, adjust neighboring
  circuit endpoints to restore connections and keep lines outside the glass.
  The frame, upper sand, falling grains, and lower sand have separate paths.
- **Main colors:** change `color` on `hourglass` and `fill` on `wordmark`.
  Each letter has its own `letter-*` path.
- **Position and opacity:** edit the relevant group's `transform` and `opacity`.
  The first translation on `hourglass` sets its position; the last translation
  defines its scaling center.

The SVG viewBox is `0 0 955 818`, matching the original image proportions.
The header icon and social preview use separate assets.

## Page and interaction ownership

- `src/lagen/layouts/Layout.astro`: LAGEN header brand, Paper and Citation links,
  More Research dropdown and MLL Lab link. The dropdown lists BAGEN, ENACT,
  RAGEN, Embodied Agent Interface, VAGEN and ViewAgent in the reference order.
  The browser, Open Graph and Twitter titles use the paper subtitle.
  At 900px and below, LAGEN and Contents occupy the first header row;
  the four resource entries occupy the second row. Header controls retain
  16px text and the small brand logo at phone widths.
- `src/pages/lagen/index.astro`: hero, Demo, Results, Method and Experiments, followed by
  citation. The hero pairs the small logo with the large purple LAGEN wordmark
  and puts the paper subtitle on the next line.
  Chapter names appear in the directory; the article uses descriptive
  headings instead. Method presents Profiling (sim2real
  calibration, latency bursts), then Pipeline. Experiments uses a Key Findings
  heading and five numbered findings: mean/profile training, cross-latency
  transfer, cross-task transfer, latency prompts and visual history.
  Each finding presents its conclusion, existing prose and expanded evidence.
  The five findings share one heading level and consistent spacing.
  The approved copy leads with contributions and uses headings without final
  periods. Figure captions explain the displayed evidence. Calibration retains
  its “How we test the simulation” details; the mean-training, transfer and
  visual-history details have been removed. Results introduces the two
  complementary latency approaches before its result sentence and recovery bars.
  Its heading is “Reducing latency is not enough. Train with it”, with no final period.
  The recovery caption identifies the RTX 3090 latency profiles and the 100%
  reference. “All 36 results” retains the paper's Zero/Zero, Zero/Real and
  Target/Real columns with a short explanation of each condition.
- `src/lagen/components/LatencyApproachesFigure.astro`: static Results concept figure.
  Both panels share the same Policy, Action execution and Environment loop,
  including inference-duration bars aligned at one start and two equal
  action chunks on separate rows of the same time axis. The lower chunk starts
  later; a handoff arrow marks when its new actions can execute. The panel
  titles are Reduce latency and Train with latency (ours). The two panel
  captions explain the mechanisms; the former overall schematic caption has
  been removed. Only the right panel's
  mechanism fills and the saved-time/handoff arrows use 40% opacity. Node
  borders, module connections and the profile stay opaque.
  Text stays fully opaque and at least 16px. Inline SVG supplies mechanisms,
  loop arrows and profile bars, with no client script.
  Module names use 18px semibold type above regular 16px example labels.
  Policy exits at the midpoint of its right edge and reaches the execution
  node with one horizontal-to-vertical turn. Module arrows connect flush to
  their source and target borders.
  The profile sits farther right, aligned with its own vertical connector;
  wide diagrams align its title with Policy. Narrow diagrams raise the profile
  to clear the centered Policy route and keep it inside the panel.
  The columns stack below 900px without shrinking the diagram text.
- `src/lagen/components/Contents.astro` and `src/lagen/scripts/contents.ts`: a shared nested
  directory with native fragment links, current-section highlighting and
  keyboard focus transfer. At 1800px and wider it floats in the centered
  article's left margin, 64px from the 1100px content column. Smaller windows
  use the header's Contents menu, which closes on selection, Escape or outside
  clicks. The article remains centered; the full directory scrolls independently
  when necessary. Existing fragment destinations remain available.
  Each directory level adds 16px of indentation. Font weights stay fixed by
  level; current-section styling uses color, a background and a left rule.
  Hover changes text color only. Navigation stays at 16px, and wrapped lines
  align with their own entry's text. Experiments directly lists Mean vs. profile,
  Latency transfer, Task transfer, Latency in prompt and Visual history.
  The original training-findings and information anchors remain available.
  Directory links move keyboard focus to the selected section.
  The script also coordinates the native More Research dropdown with Contents:
  only one dropdown can be open, outside clicks close the dropdowns, and Escape
  returns focus to the open dropdown's trigger. More Research uses native
  summary keyboard activation and ordinary links.
- `src/lagen/components/FailureDemo.astro` and `src/lagen/scripts/demo.ts`: the 12-task
  carousel, queued 460 ms transitions, delayed-video selection, playback and
  application-time action indicators. `src/lagen/scripts/action-display.ts` owns
  game keys and continuous-command schematics; `public/lagen/assets/actions/` is
  loaded per task. `interactions.ts` owns citation copy.
  There is one selected case per task.
- `src/lagen/data/demos.json`: consumed media paths, source clocks, delay variants,
  action-key events, per-lane failure frames, clip bounds and source identities. Task arrows, side previews, and
  the scrollable thumbnail strip select the same task.
- `ProfilesFigure.astro` and `HistoryFigure.astro` under `src/lagen/components/`:
  linked figures for latency structure and visual-history interfaces.
  `src/lagen/scripts/profiles.ts` renders the full request sequences on Canvas;
  axes and distributions use SVG. `LinkedReadout.astro` and
  `src/lagen/scripts/linked-figures.ts` share transient highlighting, pinned
  selection, keyboard navigation, and tooltip placement.
- `src/lagen/components/PipelineFigure.astro`: the original paper's static pipeline
  image, with its layout and labels preserved. `public/lagen/assets/figures/framework.png`
  is an unchanged copy of the high-resolution paper export.
- `src/lagen/components/DegradationFigure.astro`, `src/lagen/scripts/degradation.ts`, and
  `src/lagen/data/degradation.json`: Figure 2's inline SVG, shared main/inset column
  inspection, and the paper's selected fixed-delay readings.
- `RecoveryFigure.astro`, `CrossTaskFigure.astro`, and `CalibrationFigure.astro`
  under `src/lagen/components/`: Appendix L Figure 20's bars, cross-task curves and
  simulated/real scatter plots. Recovery shares `src/lagen/data/results.json` with
  the table; the other two consume `cross-task.json` and `calibration.json`.
  `FigureReadout.astro`, `src/lagen/scripts/figure-inspection.ts`, and
  `src/lagen/styles/interactive-figures.css` provide their common readout behavior
  and typography; each figure owns its axes, marks and numerical meaning.
- `src/lagen/components/RobustnessFigure.astro` and `src/lagen/data/latency-robustness.json`:
  matched-delay transfer heatmaps with native row/column headers, the common
  readout behavior and the paper's 100 cell ratios.
- `src/lagen/styles/lagen.css`: shared alignment, typography, responsive layouts,
  and paper colors. The hero blends the paper's purple, rose and peach into the
  light demo background. Figure grids use the available article width for their
  responsive layouts. Inter is bundled locally under the SIL Open Font License.

Only the central video plays, muted and looping, while visible. Task selection
never advances automatically. The Play/Pause button sits centered below the
active video's action indicators and above the task thumbnails.
Its fixed SVG icon and text columns stay aligned when toggled. The interception
demo is labeled “Intercept Grab (Fast)”; figures and results use “InterceptGrabFast”.
Pausing persists across task changes. Reduced
motion starts with a still poster; Play remains available. Explicit task
selection retains the 460 ms slide transition under either motion preference.
Left/right keys
switch tasks when the carousel has focus; a focused latency slider keeps its
native keyboard behavior. Figure 2 shows
all models at the nearest latency column on hover or tap. Tab focuses each
chart, arrow keys select a column, and Escape dismisses values. It uses four
columns on desktop, two on tablets, and one on phones; main plots and insets
share the selected latency. Touch readouts close on an outside tap or scrolling.
Recovery bars show before/after percentages. Cross-task
readouts compare both policies at one latency. Calibration points identify the
task, model, GPU and method, with simulated return, real return, then their
signed difference. Returns use percentages of the same zero-latency reference;
the difference uses percentage points (`pp`).
Coincident points list all associated GPUs without
displacing their coordinates. Hovering anywhere in a plot selects the nearest
column; calibration also shows a vertical real-return guide. These charts use
the same pointer, touch and keyboard conventions; recovery preserves a shared scale across task pairs
on narrow screens.
Cross-delay heatmaps select individual cells, with arrow keys moving through
training/evaluation delays and row/column labels following the selection.
Each row uses its matched-delay policy as 100%. Heatmaps use two columns on
desktop and one on phones; narrow tables scroll horizontally while evaluation
labels stay visible. Cell labels retain the full ratio even above the color
scale's 100% endpoint.
Direction summaries, “High → low latency” and “Low → high latency”, sit below
each heatmap title. Their arrows mean training → evaluation latency, and the
caption identifies the two triangle means. Hover, focus or tap a summary
to raise its ten off-diagonal cells together by 4px, with one soft shadow along
the region's outer contour. Means are calculated from unclipped cell ratios.
Selected cells retain the paper's colors at full opacity. Other cells, including
the diagonal, stay stationary at 30% opacity while a selection is active.
Leaving the selection restores the region. Individual-cell inspection restores
the region and raises only the inspected cell, with its own shadow and readout;
the other cells use the same 30% opacity. Dismissing selection restores full opacity.

The two linked figures start with all evidence visible. Hover or keyboard
focus previews a selection; click, tap, Enter or Space pins it. Selecting the
same choice again, an outside click or Escape clears it. Arrow keys move
between methods, histogram bins or results. Scroll and resize close readouts
without discarding the pinned selection; only one figure tooltip is visible.

Latency structure retains five columns on desktop. Selecting a method keeps
Measured as a reference; selecting a 2-ms bin locates the corresponding
requests across all five sequences. `public/lagen/assets/data/profiles.json` holds
all 24,225 requests per sequence and loads near the viewport. The compact
`src/lagen/data/profiles.json` holds full-support histogram counts; the website
build does not read the paper directory. Cached Canvas layers preserve all
points while keeping selection redraws small. On narrow screens each method
keeps its sequence and distribution together.

Pipeline displays the original 3988 × 1771 paper image at the article width.
A minimum display width of 1100px preserves its detail on narrow screens;
its image region scrolls horizontally with native touch or keyboard controls.
It has no diagram selection, animation, custom viewer or JavaScript.

Visual-history mechanisms, legend entries and task results share one method
selection. Desktop places the six mechanisms in two rows of three above a
single-row legend and three full-width task panels. The result SVGs use wider
plot geometry rather than stretching the previous narrow plots vertically.
The mechanism cards reproduce the supplied reference proportions: input
frames and model boxes each occupy roughly one third of the card width,
with colored title bands and a compact K/V state capsule. Selection accents
the active card without washing out the other mechanism illustrations. `src/lagen/data/history.json` contains all 17 evaluated results and one
explicit missing cell. Narrow screens wrap the mechanisms and legend, then stack the task panels;
selection persists when scrolling between them.

## Maintaining evidence and media

See [SOURCES.md](SOURCES.md) for authoritative paper assets, numerical
interpretation, and demonstration sources. [Migration status](MIGRATION.md) records the source revision, verification,
and publication status.

The teaser replays a fixed recorded action stream. The two lanes start from
the same environment state; the right lane delays action delivery. This is a
qualitative demonstration, not a fresh-policy benchmark or a training-recovery
comparison. Ten tasks use zero-latency teachers. The retained Flappy Bird and
Deadly Corridor cases preserve their original media; their old source snapshots
do not identify the teacher's training condition.

The selected cases satisfy the demonstration's outcome contract: once one
displayed delay fails, every higher displayed delay also fails within its clip.
This is a case-selection criterion, not a claim that arbitrary trajectories
have monotonic outcomes. Demon Attack, AirRaid, Atlantis and Ant were reselected
and replayed with native failure signals to meet it. Their final scenes hold
for one second so late failures remain visible. The directory entry is
“Example: latency in action”; the article heading is “Timing changes the outcome”.

Failure cues are encoded in the videos. At its existing failure frame, each
failed lane freezes and its grayscale scene dims to 72% brightness while the
red cross stays vivid. The cross's antialiased edges are composited against the
dimmed scene; retaining a hard color mask would leave a pale fringe. This also
makes failure visible in Balance, whose source scene is already monochrome.

For new recordings, retain the initial state/seed, action stream, source
checkpoint identity, clock, clip window, and zero-delay replay check in
experiment artifacts. Export only the selected case and its delay variants to
`public/lagen/assets/demos/`. Key-event ticks are relative to the displayed clip;
negative ticks can describe actions already in progress at a cropped window's
start. Delays and frame-to-millisecond conversion use the recorded source clock.
Use existing environment and policy entrypoints. One-off capture, rendering,
transfer, and checking scripts belong outside the repository and are removed
when the task finishes.

Inspect actual browser screenshots at desktop and mobile sizes, and exercise
all tasks and delay endpoints, pause/resume, keyboard navigation, reduced
motion, linked-figure pinning and dismissal, citation copy, and the three More Research links to LAGEN. Verify numeric
cells against the paper and preserve missing evaluations as unavailable.
