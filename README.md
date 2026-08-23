# ragen-ai.github.io

Main GitHub Pages site for `https://ragen-ai.github.io/`.

Project pages of the RAGEN-AI research series on reinforcement learning for LLM agents from the [MLL Lab](https://mll-lab-nu.github.io) at Northwestern University (PI: [Manling Li](https://limanling.github.io/)):

- `/` : [RAGEN-2: Reasoning Collapse in Agentic RL](https://ragen-ai.github.io/) (ICML 2026 Oral, [arXiv:2604.06268](https://arxiv.org/abs/2604.06268)) - template collapse, mutual information diagnostics, SNR-aware filtering
- `/v1/` : [RAGEN: Understanding Self-Evolution in LLM Agents via Multi-Turn Reinforcement Learning](https://ragen-ai.github.io/v1/) ([arXiv:2504.20073](https://arxiv.org/abs/2504.20073)) - StarPO, the Echo Trap
- `/bagen/` : [BAGEN: Are LLM Agents Budget-Aware?](https://ragen-ai.github.io/bagen/) ([arXiv:2606.00198](https://arxiv.org/abs/2606.00198)) - budget-aware LLM agents

## Local Development

```bash
npm install
npm run dev
```

## V2 Subsite

`/v2/` is served from static files under `public/v2/`.

To refresh the v2 subsite from `../RV-Filter-Website`:

```bash
cd ../RV-Filter-Website
SITE_URL="https://ragen-ai.github.io" SITE_BASE="/v2/" npm run build

cd ../ragen-ai.github.io
mkdir -p public/v2
cp -R ../RV-Filter-Website/dist/. public/v2/
```

After syncing, rebuild the main site:

```bash
npm run build
```

## Homepage Entry

The main homepage includes a top hero news banner:

- `News: We released RAGEN-2`

That banner links to `/v2/`.
