# Applied Models

Applied Models is a public home for empirical science and applied research on generative models.

The most important questions about generative models are still open. This is the work of finding out — direction by direction, experiment by experiment.

## Research Directions

**Fundamentals**
How do architecture choices and training dynamics produce the behaviors we observe at scale? Starting from model internals, not from benchmark scores.

**Interpretability**
Which circuits drive specific model behaviors, and can they be precisely identified and edited? Mechanistic analysis of what models actually learn, not just what they output.

**Alignment Science**
When does alignment hold under distribution shift and pressure, and how does it degrade? Behavioral consistency studied empirically across contexts.

**Post Training**
What does each training stage — fine-tuning, DPO, distillation — actually change inside the model? Behavior, or internal representations?

**RL**
Does RL genuinely improve reasoning, or does it optimize for the appearance of reasoning? RLHF, GRPO, and process reward models studied from outcome to mechanism.

**Evals**
What would a rigorous, falsifiable eval of model capability actually require? Hypothesis-driven suites for capabilities, failure modes, and behavioral consistency. Starting with Gemma.

**Industry & Enterprise**
Where do retrieval-augmented generation, structured output, and constrained decoding reliably break — and what can be done about it?

## Why These Questions

**Genuine unknowns** Every experiment starts with something that doesn't have a clear answer yet — not a demonstration of what works.

**Narrow enough to test** One model, one configuration, one measurable outcome. Small scope makes real answers possible.

**Empirical first** What the model actually does under specific conditions — not what theory predicts.

**Compounding record** Seven directions, accumulating real evidence over time. The record stays public.

## What Gets Published

**Traceable results** Every finding links back to a run done here.

**Reproducible method** Clear enough that someone else could replicate it with the same setup.

**Honest failure** Inconclusive runs and broken setups documented, not hidden. The record is not a highlight reel.

**No repackaging** Every claim traces to a run done here, not to someone else's paper.

## Reproducibility Standard

Every released artifact should be reproducible by someone else. That means:

- a clear method with enough detail to replicate
- evaluation criteria set before running
- failure modes and limitations documented
- code, configs, or prompts made available

If it can't be reproduced, it's a note — not a release.

## Behind the Work

Applied Models is a personal initiative by the builder behind [Prachalabs.com](https://prachalabs.com) and [Pracha.me](https://pracha.me).

## Models and Datasets

Public model assets: [appliedomodels on Hugging Face](https://huggingface.co/appliedomodels)

## Publication Boundary

Every release comes from direct implementation and first-hand observation.
