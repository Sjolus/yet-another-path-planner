# AI Agent Collaboration Guide

This document provides a canonical set of instructions for GitHub Copilot, GPT-based agents, or any other automation that contributes to Yet Another Path Planner. The goal is to ensure agents always read the right context, keep documentation synchronized with code, and follow the repository's architecture decisions.

## 1. Core References

Agents should always load the following files before proposing or applying changes:

1. `docs/architecture.md` — overall system design, deployment topology, and technology selections.
2. `docs/onboarding.md` — local development workflow and tooling expectations.
3. `README.md` — project overview, status, and top-level pointers.
4. `.github/copilot-instructions.md` (this file) — the rules for automation.

When modifying a specific subsystem, also read:
- Component docs under `docs/` (e.g., ADRs, runbooks).
- Corresponding code directories (`frontend/`, `backend/`, `infrastructure/`, etc.).

## 2. Change Workflow Checklist

Before coding:
1. Confirm the task aligns with existing architecture decisions; open or update an ADR if deviating.
2. Search for existing TODOs or FIXME entries related to the task.
3. Plan updates to relevant docs (architecture, onboarding, runbooks) that reflect the change.

During implementation:
1. Keep modifications scoped; avoid touching unrelated files.
2. Write concise, well-structured commits with imperative subject lines.
3. Maintain telemetry instrumentation (OTel). If adding/removing services, update Grafana/LGTM configs.

After implementation:
1. Update documentation sections impacted by the change.
2. Run the applicable lint/test commands (`pnpm lint`, `pnpm test`, etc.) or explain why they were skipped.
3. Summarize the change, verification steps, and doc updates in the PR description or final response.

## 3. Documentation Rules

- Always update `docs/architecture.md` when you add or remove high-level components.
- Adjust `docs/onboarding.md` for new prerequisites, environment variables, or workflows.
- If telemetry, CI/CD, or operational procedures change, update `ops/` runbooks and reference them here.
- Maintain a single source of truth—avoid duplicating instructions across multiple files without cross-links.

## 4. Telemetry & LGTM Awareness

- Ensure new services emit OpenTelemetry data and register with the Grafana Agent pipeline described in `docs/architecture.md`.
- When editing telemetry pipelines, double-check references to Grafana Cloud credentials and keep sensitive data in secrets, not source control.

## 5. AI-Specific Practices

- Include file paths in explanations so humans can easily review changes.
- Mention any skipped best practices and provide follow-up tasks if you cannot complete them.
- If uncertain about requirements, surface questions instead of assuming.
- Prefer ASCII content unless extending an existing file that already uses other characters.

## 6. Extensibility

As new automation tools join the workflow, append their specific instructions (naming conventions, required checks, etc.) to this document and link them from the README.
