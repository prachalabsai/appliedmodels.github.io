# Applied Models: Design Document

## 1. Overview

**Applied Models** is the umbrella for focused, empirical, hands-on work around generative models.

The intent is to consolidate learning, experimentation, implementation, and research into one coherent public project under **appliedmodels.co**.

This is not meant to be abstract research for its own sake. The core idea is to work directly with the real artifact that matters: **the model itself**.

## 2. Why This Exists

There is a large amount of discussion around generative AI, but much of it stays at the level of concepts, summaries, hype, or second-order commentary.

This project is based on a different premise:

- The real material is the model.
- If models are the core commodity, they should be treated as the primary object of study.
- Real understanding comes from touching the thing directly: running it, measuring it, breaking it, tuning it, and rebuilding parts of it.

The name **Applied Models** reflects that shift in focus. It positions models as the practical substrate for modern applied research, similar to how physical materials underpin engineering in other domains.

## 3. Core Thesis

Applied Models is about **empirical science and applied research on generative models**.

The work should be grounded in:

- direct experimentation
- measurable validation
- careful analysis
- practical implementation
- public artifacts

The emphasis is on getting real work done, not just discussing ideas. The standard mode of work is:

**Take a model -> take a hypothesis -> test it with evidence.**

## 4. Mission

Build a small, rigorous, public lab for understanding and improving generative models through experiments, analysis, and reproducible artifacts.

In practice, this means:

- studying model behavior, not just prompting outcomes
- testing claims with benchmarks and controlled experiments
- understanding failure modes, blind spots, and tradeoffs
- publishing concrete findings as code + writeups
- turning scattered learning efforts into a focused body of work

## 5. Scope

The scope of Applied Models includes the following categories.

### 5.1 Empirical Experiments

Hands-on experiments on open-source models, and where feasible, closed-source models.

This includes:

- benchmarking
- model comparisons
- controlled evaluations
- ablations
- stress tests
- failure analysis

### 5.2 Validation and Measurement

A major focus is validating what models can and cannot do.

This includes:

- task-specific evaluations
- behavior measurement
- reproducible scoring setups
- benchmark design for practical use cases

### 5.3 Interpretability and Alignment

The project should explore ways to understand internal behavior and external safety characteristics.

This includes:

- interpretability experiments
- alignment-related probing
- behavioral analysis
- safety tradeoff analysis
- studying response shifts under interventions

### 5.4 Post-Training and Fine-Tuning

Applied Models should cover practical methods for adapting and improving models after pretraining.

This includes:

- supervised fine-tuning
- preference optimization
- lightweight adaptation
- distillation
- continual learning experiments
- representation-shaping techniques

### 5.5 Model Anatomy, Biology, and Dynamics

One of the core themes is understanding how models work internally.

This includes:

- representation analysis
- model anatomy
- model biology
- training dynamics
- behavior over checkpoints
- blind spots and failure surfaces

The goal is not just to know whether a model works, but to understand **how** and **why** it behaves as it does.

### 5.6 Re-Implementation and First-Principles Understanding

Where useful, the project should re-implement models or model components from scratch to understand them properly.

Examples:

- implementing a recently released transformer architecture from scratch
- rebuilding key parts of a diffusion model
- reproducing a paper’s mechanism in minimal form

This is intended as a path to deeper understanding, not as an exercise in copying.

### 5.7 Training Under Real Constraints

If the project includes training runs, they should be done under explicit resource constraints.

This includes:

- small-budget training experiments
- transparent cost tracking
- practical recipes for limited compute
- tradeoff analysis between cost and capability

### 5.8 Industrial and Creative Applications

Applied Models should also explore where models can create real leverage in practice.

The focus is not limited to obvious chatbot or agent wrappers.

Instead, the project should investigate:

- decision-support systems
- deeper problem-solving workflows
- non-trivial model-assisted reasoning
- creative experimental applications
- domain-specific utility beyond clerical automation

The standard should be: use models where they meaningfully improve how a problem is solved.

## 6. Working Style

The operating style of Applied Models is intentionally practical.

The work should be:

- empirical rather than purely speculative
- hands-on rather than commentary-driven
- artifact-first rather than presentation-first
- simple and direct in execution

The recurring workflow is:

1. Choose a model.
2. Define one specific hypothesis and the key questions that would validate or falsify it.
3. Run an experiment, analysis, or implementation.
4. Record what happened.
5. Publish the artifact and the explanation.

This is the "dirty research" approach: do the work, collect evidence, and show the result plainly.

In practice, the unit of progress should be small and concrete:

- one hypothesis
- a few key questions
- one focused experiment
- one publication of results

This keeps the work moving and prevents the project from collapsing into indefinite planning.

## 7. Outputs and Artifacts

The output model should stay simple and repeatable.

### 7.1 Experiments

Each experiment should include:

- the core idea or question
- the model(s) used
- what was done (training, analysis, benchmarking, probing, etc.)
- code, configs, or Python notebooks where relevant
- results and limitations

### 7.2 Articles

Articles should present findings cleanly and accessibly.

They should explain:

- what was tested
- why it matters
- how it was done
- what was observed
- what the result implies

Articles should be based on original work from this project.

They are not meant to be:

- learning notes
- summaries of someone else's paper, blog post, or thread
- second-hand commentary without new evidence

The standard is simple: publish only when there is an original implementation, experiment, observation, or concrete finding to report.

### 7.3 Code and Python Notebooks

The repository should contain practical working artifacts, not only prose.

This includes:

- Python notebooks (Jupyter notebooks)
- scripts
- small libraries
- experiment recipes
- reproducible reference implementations

### 7.4 Records of Real Work

The repo should function as a record of real work in progress.

That means:

- real implementations
- real experiments
- real logs
- real observations
- real failures

Even if an experiment fails, produces weak evidence, or leads to an unconvincing result, it can still be worth publishing if the work is genuine and the record is honest.

The value is in maintaining a truthful trail of attempted work, not in pretending every result is decisive.

## 8. Platform and Publishing Model

The project should be lightweight, public, and easy to maintain.

### 8.1 Repository as Source of Truth

GitHub should serve as the main workspace because it supports:

- Python notebooks
- code
- markdown content
- experiment logs
- versioned iteration

It also keeps the project close to the actual artifacts instead of separating the website from the work.

### 8.2 Static Site

The website should be a lightweight static site hosted on **GitHub Pages**.

Desired characteristics:

- simple deployment
- low maintenance
- fast rendering
- easy publishing from markdown-based content

### 8.3 Content Format

The authoring workflow should prioritize:

- Markdown
- MDX
- Python notebooks (Jupyter notebooks)

The ideal setup is:

- write markdown or Python notebooks
- commit to GitHub
- render cleanly into HTML on the site

### 8.4 Tech Direction

A lightweight TypeScript-based site is the intended direction, with support for rendering markdown/MDX content cleanly.

The implementation should stay minimal and should not introduce unnecessary operational complexity.

## 9. Suggested Information Architecture

The site and repo should be organized around the actual work.

Suggested top-level sections:

- `/experiments/` for experiment logs and structured results
- `/articles/` for writeups and analysis posts
- `/notebooks/` for Python/Jupyter notebooks tied to experiments and implementations
- `/recipes/` for practical training or evaluation recipes
- `/assets/` for static assets

Suggested homepage sections:

- what Applied Models is
- latest experiments
- latest articles
- current themes of work
- links to code and Python notebooks

## 10. Positioning

Applied Models is not intended to be:

- a generic AI news site
- a prompt collection
- a thin chatbot wrapper project
- a marketing surface for vague "AI solutions"
- a repository of passive learning notes
- a place to repost or lightly summarize other people's work

It is intended to be:

- a focused public research-and-build lab
- a home for serious experiments on generative models
- a place where learning is converted into artifacts
- a practical record of empirical work

## 11. Design Principles

The project should follow a few fixed principles.

- **Model-first:** the model is the primary object of study.
- **Evidence-first:** claims should be supported by experiments or clear reasoning.
- **Artifact-first:** publish code, Python notebooks, and logs alongside conclusions.
- **Simplicity:** keep the workflow and publishing stack lightweight.
- **Practicality:** prioritize useful experiments over performative complexity.
- **Clarity:** present methods and findings plainly.
- **Progress over prestige:** the work does not need to be state of the art to be valuable.
- **Serendipity matters:** useful findings often emerge from sustained hands-on work, not only from grand benchmark wins.
- **Originality of record:** publish original observations from real work, not recycled commentary.
- **Honest incompleteness:** failed, partial, or non-conclusive experiments are still valid outputs if documented truthfully.

The project should explicitly avoid over-optimizing for state-of-the-art results as the default goal.

For an individual researcher or a small independent effort, chasing SOTA too aggressively can halt progress, narrow experimentation, and reduce output.

The better standard is:

- keep the work in motion
- run tractable experiments
- publish useful findings
- let insights compound over time

## 12. Near-Term Direction

The immediate goal is to establish Applied Models as the public home for ongoing experiments and writeups.

Near-term priorities:

1. Set up the lightweight GitHub Pages site.
2. Define the content structure for experiments, articles, and Python notebooks.
3. Publish initial experiments and supporting writeups.
4. Build a repeatable workflow for logging research and rendering it to the site.

## 13. One-Line Summary

**Applied Models is a public, lightweight, artifact-first lab for empirical science and applied research on generative models.**
