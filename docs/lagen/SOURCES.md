# Content and demonstration sources

Original website source: `mindorigin150/lagen@5e95bfd`, retained in a private
archive. Public source is available in [the migration PR](https://github.com/RAGEN-AI/ragen-ai.github.io/pull/1).
Paper and `../outputs/` paths below identify the original authoring workspace.
They are provenance records, not dependencies of this website build. Website
source and public asset paths identify their new locations in this repository.

## Manuscript snapshot

The page follows the current named-author `../paper/arxiv.pdf` and active
sources, verified on 2026-10-04. Paper repository HEAD during verification:
`bee7add`. The downloaded PDF is byte-identical to that working-copy PDF.
Website numerical data use the manuscript's selected observations. Figure 2's
paper exports and the downloadable PDF include the corrected latency alignment.

Paths in this table are relative to `../paper/`.

| Website evidence | Canonical source |
| --- | --- |
| Title, eleven authors, institutions and contribution notes | `arxiv.tex` |
| Paper download | `arxiv.pdf` → `public/lagen/assets/paper.pdf` |
| Hero logo | `arxiv/figures/lagen-logo.png` |
| Semantic colors | `paper_colors.py` → `src/lagen/data/paper-palette.json` |
| Fixed-delay degradation, Figure 2 | `figures/fig2_vla_degradation/data.csv` and `plot.py` → `src/lagen/data/degradation.json` and inline SVG |
| Recovery bars, Appendix L Figure 20 | `figures/fig1_teaser/data.csv` and `bar_hatched/fig.pdf` → `src/lagen/data/results.json` and inline SVG |
| Framework, Figure 3 | `figures/mll/figure3_v2.png` → unchanged `public/lagen/assets/figures/framework.png` |
| Measured latency structure, Figure 5 | `figures/fig5_profiling_structure/data.csv` and `plot.py` → `src/lagen/data/profiles.json`, `public/lagen/assets/data/profiles.json`, Canvas/SVG |
| Held-out calibration, Figure 4 | `figures/fig4_sim2real_calibration/heldout_30cases_20261002/case_errors.csv` and `plot.py` → `src/lagen/data/calibration.json` and inline SVG |
| Main 36-pair table | `figures/fig1_teaser/data.csv` |
| Mean-delay/profile comparison, Table 2 | `tables/mean_delay_training/data.json` and `table.tex` |
| Cross-delay transfer, matched-delay view of Figure 6 | `figures/fig6_latency_robustness/matched_delay/cells.csv` and `plot_matched_delay.py` → `src/lagen/data/latency-robustness.json` and interactive heatmaps |
| Cross-task transfer, Figure 7 | `figures/fig21_demon_mixed_cross_task/data.csv` and `plot.py` → `src/lagen/data/cross-task.json` and inline SVG |
| Delay prompt, Table 3 | `tables/table2_latency_information_ablation/render_table.py` computes `table.tex` and `summary.json` from `data.csv` and `demon_attack_means.csv`; copy `summary.json` to `src/lagen/data/prompt.json` |
| Visual history, Figure 8 | `tables/table7_memory_comparison/render_table.py` and source CSVs; `figures/fig7_memory_interfaces/draw_mechanisms.py` → `src/lagen/data/history.json` and SVG/HTML |

Paper plots retain their data, axes and semantic colors. Fixed-delay,
recovery, cross-task and calibration figures use inline SVG with hover, touch
and keyboard readouts. Cross-delay transfer uses native HTML heatmap tables
with the same readouts. Latency structure and visual history use native linked
figures with hover, touch, keyboard and pinned selection. Pipeline displays
the original paper image.

## Linked-figure snapshots (2026-10-05)

Latency structure exports only the 24,225 `request` rows of
`figures/fig5_profiling_structure/data.csv`, in source order. The full JSON
stores `sample_index`, `worker_id`, `measured_action_ready_ms`,
`fixed_latency_ms`, `normal_latency_ms`, `iid_latency_ms` and
`temporal_latency_ms` as indices, workers and five full-precision series.
The 22,500 separate `profile` rows are not the measured plot trace.
Histogram edges follow `plot.py`: shared 2-ms bins from the pooled full
support, with density `count / (24,225 * 2)`. Each readout uses the exact
half-open bin interval. Charts show 45–100 ms, but counts and normalization
include all samples. The historical Temporal sequence's six negative values
remain unchanged; they are a source-model limitation, not physical latency.
Source statistics, worker identities and marker shapes are preserved.
This is the frozen OpenVLA/Flappy A100 diagnostic sequence from the source
README, not an additional held-out calibration or return experiment.
Generated slow periods need not occur at measured indices and their frequency
and level still differ. The website does not claim identical marginals or
pointwise agreement. Source artifact revision and sampler details remain in
`figures/fig5_profiling_structure/README.md` and `sources.json`.

Pipeline uses a byte-identical copy of the 3988 × 1771
`figures/mll/figure3_v2.png`, matching the supplied paper reference. Its labels,
colors, module geometry, illustrations and arrows are preserved. The website
does not redraw or rearrange the figure. The original image keeps its aspect
ratio and a minimum displayed width of 1100px, with local horizontal scrolling
on smaller screens. Profile traces in the image are schematic; replay still
means fresh interactions under sampled timing, not recorded trajectories.

Visual-history values use `merged_values` from
`tables/table7_memory_comparison/render_table.py`, fed by its canonical
comparison CSV and `exps/memory/compare_table/wanoft/data.csv`.
All 17 means and interval endpoints are normalized by the same task's
single-frame mean. WanOFT's Student-t intervals are recomputed by that
reader from population standard deviation and 20 episodes; the historical
normal-approximation intervals in its CSV are not used. The other five
interfaces use the accepted 100-episode observations. There is one training
run per cell; intervals describe episode sampling. Ghost trail on Deadly
Corridor is explicitly `null`, not a zero or a substitute result.
`public/lagen/assets/history/` copies the five committed Flappy frames and the
Ghost-trail image. The latter uses the same (0,60)–(288,348) viewport as
`draw_mechanisms.py`. Single-frame and KV use frame 5; prompt and grid use
frames 2–5; WanOFT uses frames 1–5. KV arrows represent reads and writes
of layerwise historical image K/V states, not a stack of input images.
Mechanism diagrams follow the supplied paper reference: colored title bands,
large input frames, VLA / World Model boxes, action symbols and a K/V capsule
with three retained frame blocks. Visible method names use Single frame and
KV memory. These presentation labels leave the experiment keys unchanged;
WanOFT remains a different-backbone reference, not a controlled input-only ablation.

## Results concept figure

`src/lagen/components/LatencyApproachesFigure.astro` presents an execution system
and the same system with latency-aware training added. Both panels use the
same loop markup, node positions, dimensions and arrow paths: Environment →
Policy → Action execution → Environment.

Inside Policy, Faster inference accompanies two duration bars with the same
start: the blue bar ends earlier than the gray bar. A left-pointing arrow
between their endpoints makes the saved duration explicit.

Action execution uses the timing semantics in Figure 1 of Black et al.,
[Training-Time Action Conditioning for Efficient Real-Time Chunking](https://arxiv.org/pdf/2512.05964#page=2).
Two eight-action chunks occupy separate rows of one time axis. With the
illustrative H=8, s=4, d=2, the upper chunk covers [0, 8) and the lower chunk
covers [4, 12). The upper rose prefix [4, 6) continues executing during
inference. Its aligned hatched counterpart on the lower row is retained
conditioning input, not a second execution. A downward arrow at step 6 marks
the switch to new lower-row actions [6, 12). The unused upper tail [6, 8)
is hollow. The prefix fits inside the overlap, satisfying d ≤ H−s. These are
schematic timing choices, not measured settings or a claim that all evaluated
configurations use RTC or all displayed optimizations.

The right panel preserves all three mechanisms, their shapes and colors.
Filled regions and the saved-time/handoff arrows of the two right-side
mechanism illustrations use 40% opacity. Node borders, loop lines and all text remain
fully opaque. A fully opaque purple profile and arrow introduce deployment
delays into action execution during simulated training, following
`paper/sections/latency_aware_training.tex`. The profile is not a Policy input
or an extra deployment-time wait module. The Policy box abstracts the training
recipe; teacher RL and VLA distillation remain in Method. Profile bars have
no measured time scale. Hardware-timed evidence remains in the following
recovery bars and the unchanged 36-row table. The approved panel titles are
“Reduce latency” and “Train with latency (ours)”. Each panel retains its own
explanation; the overall schematic caption has been removed.

Visual hierarchy uses 18px/650 module titles, regular 16px example labels,
2px node borders and 1.8px loop arrows. The profile title uses 18px/600 and
aligns with the Policy title in wide diagrams. Its 126×45px bars are centered on the vertical
profile connector, to the right of the Policy-to-action entry. Policy uses
one horizontal-to-vertical turn, starting at the midpoint of its right edge
and ending toward the execution node's center. All module connections start
and finish at node borders without gaps. On narrow diagrams, the profile
moves upward to clear the centered Policy route; its connector extends to
the same target border. Its rightward placement is limited by the panel edge.
Timing-axis and cell-outline strokes retain normal contrast.

## Existing numerical figures

Figure 2's website snapshot contains the 72 readings selected by `plot.py`:
Flappy Bird 0–4 frames, Demon Attack 0/2/4, Deadly Corridor 0–5, and InterceptGrabFast
0–4 for both H1 and H8. Insets use the same positive-latency values. Readouts
retain source precision. Public labels and readouts use the paper's architecture
names: OpenVLA, π₀.₅ and GR00T. These replace the source implementation labels
QwenOFT, QwenPI and QwenGR00T without changing values or source identifiers.
All markers at one latency share exactly the same x coordinate in both the
paper figure and website, including insets and the column guide. The website build
uses the checked-in snapshot and does not require the paper directory.

Recovery uses Figure 20's 12 tasks, task order, three architecture colors,
hatched baseline regions, solid training increments and 100% reference.
The baseline top is the before value; the full bar top is the after value.
Their shared denominator is the original policy's zero-latency return.
The chart and existing results table consume the same 36 full-precision
records. Tooltips show before/after percentages to two decimal places.
Narrow screens show six consecutive task pairs
with the same percentage scale, rather than shrinking twelve task labels.

Cross-task uses all 24 mean returns from the four tasks at 0/2/4 raw frames.
Each latency readout shows both training conditions. Calibration retains all
120 method/case observations: 30 task/model/GPU cases × four methods. Its
readouts show simulated mean and real mean in `%`, then signed `sim - real`
in percentage points (`pp`), all to two decimal places. All three use the same zero-latency return as their
reference: the difference is `100 * (sim_return - real_return) / reference_return`.
All plotted
coordinates use full precision. Coincident observations retain their true
coordinates and share a readout listing every GPU at that location. Hovering
anywhere in a plot selects the nearest real-return column, with a vertical
guide through the selected observation; arrow keys select observations too.

Cross-delay transfer uses all 100 full-precision ratios in `matched_delay/cells.csv`.
For evaluation delay `e` and training delay `t`, the displayed percentage is
`100 * S[e,t] / S[e,e]`: every diagonal cell is 100%. This denominator is the
matched-delay policy at the same evaluation delay, not the row maximum.
Cells and readouts retain negative and above-100% values, rounded to one decimal
place. The shared linear color scale runs from -5% to 100% and saturates at
its endpoints, matching the source plot. The grids use two columns on desktop
and one on phones to keep cell text at 16px. Narrow tables scroll locally with
pinned evaluation labels. Hover or tap selects a cell; arrow keys move by row
and column. Each panel's title is followed by “High → low latency” and
“Low → high latency” means, computed from the full-precision ratios of the ten strictly off-diagonal
cells per direction, with equal weights. These match `matched_delay/summary.csv`.
Hovering, focusing or tapping a direction raises its ten cells together by 4px
with one soft shadow around the region: right/lower for high-to-low, left/upper
for low-to-high. Selected cells retain their source colors and values at full
opacity; unselected cells, including the diagonal, stay stationary at 30% opacity.
Leaving the selection returns the region to
the grid. Inspecting a single cell restores the region and raises only that cell
with its own shadow and readout, while all other cells use the same 30% opacity.
Dismissing selection restores full opacity. Titles and summaries share
the visible grid's center; high-to-low labels and values are bold, while
low-to-high uses regular weight. The figure caption defines training → evaluation
and the two triangle means. The paper retains the checkpoint and episode
conditions; the website's evaluation-conditions foldout has been removed.

## Quantitative interpretation

- Main recovery scores use each original task/architecture policy's zero-delay
  return as the denominator for both before and after training. All 36 pairs
  improve; median pre-adaptation retention is 6.5757%, displayed as 6.6%.
  Values above 100% remain valid. Main-table InterceptGrabFast scores are returns, not
  success rates. HalfCheetah and Humanoid are outside the current 12-task set.
- Main real-time results and fixed-delay degradation sweeps have different
  evaluation clocks and policy setups. Six tasks share their benchmark rate;
  Flappy Bird, AirRaid and four MuJoCo tasks use architecture-specific rates
  in the main real-time experiment. Game main results include eight-step history.
- Calibration fits on 25 runs and evaluates on 25 held-out runs per case, two
  episodes per run, across 30 task/model/device cases. NMAE values are 8.93,
  6.55, 4.58 and 3.81 pp for Fixed, Normal, IID and Temporal. This includes
  inference-capacity modeling and is not an ordering-only causal comparison.
- Table 2 uses population standard deviations and single-training-seed means.
  Gains are `100 * (profile / mean - 1)` using unrounded values. Evaluation
  placement, evaluators and batching differ; Ant also compares different
  episode counts and hardware-timed versus simulated evaluation. The page
  states this limitation next to the table.
- Cross-delay heatmaps normalize each evaluation row by its matched-delay policy.
  Game cells use 20 evaluation episodes. InterceptGrabFast's train-zero column uses 200
  held-out episodes; conditioned columns use 100 development episodes and
  differ in input, checkpoint budget, and action commitment.
- Table 3 contains Flappy Bird and Demon Attack at delays 0–4. Each cell shows
  mean return ± a two-sided Student-t 95% confidence interval over 20 evaluation
  episodes. The half-width is `t(0.975, n-1) * sample_std / sqrt(n)`.
  Flappy Bird uses episode returns; Demon Attack uses the step-7,000 summaries,
  converting the evaluator's population standard deviation to sample standard
  deviation before calculating the interval. The paper renderer produces both
  the LaTeX table and `summary.json` at one-decimal precision; the website uses
  an identical copy of that JSON. These intervals describe episode variation,
  not variation across training seeds. Prompt delay is the assigned condition,
  not a prediction of future hardware runtime.
- Visual-history results use the same-delay single-frame baseline, not the
  main results' zero-delay reference. WanOFT is a separate architecture;
  Ghost trail on Deadly Corridor was not evaluated.
- Figure 2's existing paper caption says chunked InterceptGrabFast reaches zero at four
  frames, while its plotted data and body text give 6.0–7.5%. The website uses
  the plotted-data/body-text value and leaves manuscript sources unchanged.

## Failure demonstrations

One selected case is shown per task. Left is immediate action delivery; right
replays the same action stream with a fixed delay. No policy makes new decisions
after the two branches diverge. These clips illustrate timing sensitivity;
they are not representative success-rate estimates or evidence of adaptation.

The new recordings use the public zero-latency small-policy bundles in
[`MLL-Lab/LAGEN-models`](https://huggingface.co/MLL-Lab/LAGEN-models/tree/main/zero-latency),
pinned to revision `525b3bc5c79c1f08711368ff89a7b5916ba5f175`.

| Task | Teacher bundle under `zero-latency/` | Seed | Clock | Displayed source window | Default delay |
| --- | --- | ---: | ---: | --- | ---: |
| Demon Attack | `demon-attack/small-policy/sample-factory-v1` | 42 | 60 Hz | frames 60–779 | 12 frames / 200 ms |
| AirRaid | `air-raid/small-policy/sample-factory-v1` | 43 | 50 Hz | frames 0–599 from the saved late-game state below | 8 frames / 160 ms |
| Asterix | `asterix/small-policy/sample-factory-v1` | 42 | 60 Hz | frames 0–719 | 12 frames / 200 ms |
| Atlantis | `atlantis/small-policy/sample-factory-v1` | 42 | 60 Hz | frames 570–1289 | 16 frames / 267 ms |
| Ant | `ant/small-policy/sample-factory-v1` | 43 | 20 Hz | frames 40–279 | 4 frames / 200 ms |
| Hopper | `hopper/small-policy/sample-factory-v1` | 42 | 125 Hz | frames 0–999 | 4 frames / 32 ms |
| Inverted Pendulum | `inverted-pendulum/small-policy/sample-factory-v1` | 42 | 25 Hz | frames 0–299 | 2 frames / 80 ms |
| Walker2D | `walker2d/small-policy/sample-factory-v1` | 42 | 125 Hz | frames 0–981 | 4 frames / 32 ms |
| Balance | `humanoidbench-balance-simple/small-policy/fasttd3-h1-v1` | 42 | 50 Hz | frames 0–599 | 1 frame / 20 ms |
| InterceptGrabFast | `mikasa-intercept-grab-fast/small-policy/ppo-v1` | 4242424243 | 20 Hz | frames 0–59 | 2 frames / 100 ms |

Source clocks come from the teachers' environments. Video encoding can sample
fewer frames; it does not change the simulated action delay. The reselected
Demon Attack, Atlantis and Ant cases replay their zero-delay prefix to a common
branch state, then apply the chosen delay from that state. The delayed lane
holds the preceding applied command until its first delayed command arrives.
Action indicators use the same clip-relative clock and initial command.
Small red crosses follow native termination/life signals; time-limit
truncation does not count as failure. InterceptGrabFast uses its final grasp-and-static
success condition at raw frame 59, followed by a one-second hold.

The four reselected cases reproduce their saved zero-delay reward traces within
`1e-8`. The earlier retained recordings' observation/reward checks remain in
their source artifacts. InterceptGrabFast CPU-physics replays passed with `rtol=atol=1e-5`
and retained the exact success sequence. GPU rendering is used for InterceptGrabFast.
Its selected zero-delay rollout succeeds; delays of two frames and above miss.
Balance also uses its zero-delay teacher; no VLA recording or policy training
was necessary. Ant's camera field of view was widened for full-body visibility.
Hopper's historical registration name was explicitly translated to the current
wrapper while preserving its native environment and observation/action contract.

Current Demon Attack, AirRaid, Atlantis and Ant action streams, initial states,
selection records and exports are retained under `../outputs/lagen-monotonic-20261005/`.
The other source recordings remain under `../outputs/lagen-website-20261004/`.
Website entries retain the exact checkpoint identity. The new Demon Attack
teacher is `best_000048704_24936448_reward_27118.050.pth` in its pinned bundle.

The two legacy game cases preserve media from website commit `8c1bb81`:
Flappy Bird case 2 and Deadly Corridor case 1. Their original
training condition is not recorded in the old website snapshot. The retained
source contains action events and clocks; the website does not relabel these
as verified zero-latency-teacher rollouts. Unselected public copies were removed;
the original cases remain in website Git history.

The demonstration's selection criterion is monotonic failure across the shown
delay choices: after the first failing choice, all higher choices also fail
within the displayed window. This concerns these curated examples, not arbitrary
trajectories or benchmark success rates. Failure times themselves need not be
monotonic. The revised cases have these native outcomes:

| Task | Surviving delays (frames) | Failing delays (frames) |
| --- | --- | --- |
| Demon Attack | 0 | 4, 8, 12, 16 |
| AirRaid | 0 | 4, 8, 12, 16, 24 |
| Atlantis | 0, 4, 8, 12 | 16, 24 |
| Ant | 0, 1 | 2, 4, 8, 16 |

AirRaid starts at a reachable late-game state saved after 950 frames of a
four-frame-delayed replay of the seed-43 source action stream. From that common
state, the zero-latency teacher generates a new 600-frame action stream. All
six displayed variants replay that same stream and state; no policy reacts
after the variants diverge. `air-warmup-source.npz`, the selected trajectory's
serialized ALE state, and `air-raid-selected.json` retain this initialization.
This replaces the previous window that omitted higher-delay terminal events.

## Teaser correction and applied commands

The original correction evidence is retained under
`../outputs/lagen-teaser-20261004/` (see `REPORT.md`). Current replacements are
identified above; their exporters replay saved states and actions without
calling a teacher during the paired replay.

Each failed pane holds a grayscale scene with a centered square red X of side
`min(0.55 × content width, 0.40 × content height)` and stroke about `0.04 × side`.
Video padding is excluded. Text outcome badges have been removed. Walker2D's
terminal frame is included even when it falls between regular encoded samples.
Hopper's zero-delay time limit remains unmarked.

Failed scenes dim to 72% brightness, including in Balance's already monochrome
environment. Red crosses use continuous edge coverage over that dimmed scene
without a pale fringe. The reselected cases render the cue directly from the
native terminal scene; their final paired scene holds for one second after
the displayed action stream. The earlier brightness correction's media checks
remain under `../outputs/lagen-editorial-20261005/`.

The two legacy games are re-encoded from their retained movies. At the
original failure cue, the last unobscured frame is grayed and held with the new
small X, replacing the original burned-in large X. Thus the legacy failure
scene is the preceding clean encoded frame, not a recovered simulator frame;
action events and latency values remain unchanged. The old Demon Attack case
was replaced because its 12-frame failure and 16-frame survival did not satisfy
the current case-selection criterion.

Indicators show **applied commands**: at raw clip frame `t`, left uses request
`t` and right uses `t − delay`. Each lane's clock stops at its own failure frame;
End holds also clamp to the last simulated frame. Zero delay therefore matches
exactly. Negative event ticks retain the initial command needed by the delayed
lane before its first command arrives. Pause, seek and loop use the video's clock.

- Ant (8), Hopper (3) and Walker2D (6) use signed normalized torque bars with
  the same fixed range in both panes. The skeleton itself does not articulate.
- Balance exports only seven RMS target-update magnitudes. In the raw G1 order
  from `latency_bench/envs/humanoidbench_sonic_contract.py`, the slices are left
  leg `[0:6]`, right leg `[6:12]`, torso `[12:15]`, left arm `[15:22]`, right arm
  `[22:29]`, left hand `[29:36]`, right hand `[36:43]`. Each group uses
  `sqrt(mean((target[t] − target[t−1])²)) / 2`; the preceding initial target is
  taken from the saved observation. Initial holding updates are zero.
- InterceptGrabFast exports the real controller's `_clip_and_scale_action` result.
  Translation is divided by its 0.1 m range. Rotation is norm-clipped by the
  controller and divided by the magnitude of its 0.1 rad range; this version's
  negative rotation scale is preserved. Gripper target aperture is normalized
  from `[0, 0.04]` to `[-1, 1]`; the initial open command is `1`. It depicts the
  commanded aperture, not successful grasping.

## Design and font sources

The hero's alignment and type hierarchy follow the supplied
[BAGEN reference](https://ragen-ai.github.io/bagen/), using LAGEN's own palette.
Its gradient uses the paper's purple, rose and peach, fading into the demo
background. The approved October 6 copy follows
[Anthropic's explanatory writing](https://www.anthropic.com/engineering/building-effective-agents)
and STE clarity principles: contributions first, direct headings, short
explanations and captions that explain the evidence. Model implementation
details remain in the paper. The approved Results text contrasts reducing
latency with training agents to act under it. RTX 3090 identifies the training
latency profiles in the recovery caption. The 36-row table retains the paper's
Zero/Zero, Zero/Real and Target/Real column names, values and normalization.
All quantitative statements remain grounded in the paper. In particular, the
two-frame 1.2–7.1% return range applies to the six policies on Flappy Bird and
Demon Attack in `sections/world_pausing.tex`, not to every benchmark task.
The retained original LAGEN carousel supplies the central/side-preview treatment;
it now navigates tasks instead of three cases within a task.

Inter is self-hosted from [Google Fonts' Inter distribution](https://github.com/google/fonts/tree/main/ofl/inter),
converted losslessly from its variable TrueType font to WOFF2. Its SIL Open
Font License is included at `public/lagen/assets/fonts/OFL.txt`. The page does not
wait for an external font stylesheet before initializing its interactions.

## Hugging Face paper asset catalogue

The homepage keeps the Models, Data and Profiles links. The [paper asset catalogue](https://huggingface.co/datasets/MLL-Lab/LAGEN-datasets/tree/e0f4007f504978f93c32557ea4e9b97fdf62fcf5/experiments) provides Visual history, Latency in prompt, Latency transfer and Mean vs. profile training. Experiment pages link to task settings and immutable asset manifests. No website numerical inputs changed.
