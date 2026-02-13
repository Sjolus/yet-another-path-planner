---
applyTo: "docs/**/*.md"
---

# Documentation Guidelines

When updating documentation, follow these guidelines:

## Core Documentation Files

1. **`README.md`** - Project overview, quick start, and high-level pointers
2. **`docs/architecture.md`** - System design, deployment topology, technology choices
3. **`docs/onboarding.md`** - Local development setup and workflows
4. **`.github/copilot-instructions.md`** - AI agent collaboration rules
5. **`CLAUDE.md`** - Quick reference for Claude and other AI assistants

## Documentation Standards

1. **Keep Documentation Synchronized**
   - Update docs whenever code changes affect them
   - If you add/remove services, update architecture.md
   - If you change dev workflows, update onboarding.md
   - If you add new tools, update relevant documentation

2. **Architecture Decision Records (ADRs)**
   - For significant architectural changes, create an ADR in `docs/adrs/`
   - Use numbered format: `001-decision-title.md`
   - Include: Context, Decision, Consequences

3. **Writing Style**
   - Use clear, concise language
   - Provide code examples where helpful
   - Use markdown formatting consistently
   - Include links to related documentation

4. **Structure**
   - Start with a brief overview
   - Use headings to organize content
   - Include practical examples and commands
   - Link to official documentation for external tools

5. **Maintenance**
   - Review docs quarterly for accuracy
   - Remove outdated information promptly
   - Keep command examples up to date
   - Ensure all links work

## Special Files

- **Runbooks** (`ops/runbooks/`) - Operational procedures, troubleshooting guides
- **Issue/PR Templates** (`.github/`) - Maintain consistency with copilot-instructions.md
- **Docker README files** - Each component's Docker usage and build instructions
- **Infrastructure docs** (`infrastructure/README.md`) - Helm chart usage, configuration reference, and deployment instructions. Update when changing chart structure, values, or dependencies.

## Never

- Don't duplicate information across files without cross-references
- Don't commit secrets or credentials in documentation
- Don't make assumptions - document actual behavior
- Don't use obscure abbreviations without defining them first
