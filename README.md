# appliedmodels.co

**Empirical science & applied research on generative models.**

This repo powers the GitHub Pages site at **appliedmodels.co** by Pracha Labs.

---

## What is Applied Models?

Applied Models is a public lab focused on **evidence-first work** on generative models (LLMs, VLMs, multimodal, agentic systems).

The vibe is simple:

**Measure → Understand → Improve → Ship (with receipts).**

We publish:
- **Empirical analysis & benchmarking** (eval suites, comparisons, ablations)
- **Interpretability & alignment** (probing, behavior shifts, safety tradeoffs)
- **Post-training & fine-tuning** (cost-effective recipes, DPO/ORPO/LoRA/GRPO, Distillation, Model Dynamics & Algebra)
- **Training small models from scratch** (controlled runs, dynamics, checkpoints under a small $ budget)
- **Search / retrieval / memory tools (FOSS)** (RAG baselines, memory policies,context)
- **Compact Python libraries** (pip-installable tools for evals/probes/RAG-lite/harness/analysis)

---

## Micro-release standard (quality bar)

Every “release” (dataset / model / tool / report) should include:

- ✅ Clear question / hypothesis  
- ✅ Method + data + compute details  
- ✅ Evaluation with baselines  
- ✅ Failure cases / limitations  
- ✅ Repro steps (script/config/seed)  
- ✅ Artifacts + license

If it can’t be reproduced, it’s a note—not a release.

---

## Where to find things

- **Published homepage:** `index.html`
- **Published experiment pages:** `/experiments/`
- **Published article pages:** `/articles/`
- **Published notebook pages:** `/notebooks/`
- **Content sources:** `/content/experiments/` and `/content/articles/`
- **Python notebooks:** `/notebooks/*.ipynb`
- **Build script:** `scripts/build.mjs`
- **Static assets:** `/assets/`

---

## First experiment

**Experiment 0001 — Agentic Evals (small-model friendly)**  
Log: `experiments/0001-agentic-evals.html`

Goal: build a tiny, reproducible suite to test whether small models can:
- plan multi-step actions
- choose tools when prompted
- self-correct after mistakes
- resist distractors

Deliverable (v0.1):
- prompt set + scoring rules
- a simple runner script (later)
- baseline table on 2–3 open models

---

## Local dev

Build the site:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
# open http://localhost:8080
```

---

## GitHub Pages (custom domain)

This repo should be published via **Settings → Pages** (Deploy from branch: `main` / root).

GitHub will create/maintain the `CNAME` file when you set the custom domain in Pages settings.
