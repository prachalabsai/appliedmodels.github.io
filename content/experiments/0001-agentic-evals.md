---
title: Experiment 0001: Agentic Evals for Small Models
date: 2026-02-28
summary: A compact evaluation suite for planning, tool choice, self-correction, and distractor resistance in smaller open models.
status: In progress
kind: Eval suite
---
## Hypothesis

Small open models can demonstrate useful agentic behavior if the evaluation tasks are tightly scoped, scored clearly, and designed to expose specific failure modes instead of vague "agent quality."

## Key Questions

- Can the model maintain a multi-step plan without dropping steps?
- Can it choose the right tool when the prompt presents multiple options?
- Can it recover after an explicit mistake or contradiction?
- Can it ignore distractor instructions that are plausible but irrelevant?

## Why This Experiment

This is the first Applied Models experiment because it is tractable, testable, and cheap enough to iterate on quickly.

It is also a strong fit for the project standard:

- one hypothesis
- a few concrete questions
- one small experiment
- one public record of the work

## Initial Design

The first pass is intentionally small.

1. Build a prompt set with controlled tasks.
2. Define scoring rules that can be applied consistently.
3. Run a few small open models on the same prompts.
4. Record where the models fail, not just where they succeed.

## What Counts as Output

The v0.1 output for this experiment is:

- prompt cases
- scoring rules
- baseline runs
- failure notes
- one Python notebook for sanity checks and baseline comparison

## Constraints

- Keep the compute budget low.
- Prefer transparent scoring over complicated automation.
- Optimize for reproducibility, not benchmark theater.

## Current Status

This is still being shaped. The value of publishing it now is to establish the operating loop and keep the work in motion.
