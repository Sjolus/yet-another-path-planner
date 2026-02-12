# Yet Another Path Planner

A tool for finding, creating, and tracking flight tours for flight simulation careers.

[![Commit Activity](https://img.shields.io/github/commit-activity/y/Sjolus/yet-another-path-planner?label=commit%20activity)](https://github.com/Sjolus/yet-another-path-planner/commits/main)
[![CI](https://github.com/Sjolus/yet-another-path-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/Sjolus/yet-another-path-planner/actions/workflows/ci.yml)
[![Build and Push Docker Images](https://github.com/Sjolus/yet-another-path-planner/actions/workflows/docker-build.yml/badge.svg)](https://github.com/Sjolus/yet-another-path-planner/actions/workflows/docker-build.yml)
[![Coverage](https://img.shields.io/badge/coverage-coming%20soon-lightgrey)](docs/architecture.md)
[![Version](https://img.shields.io/github/package-json/v/Sjolus/yet-another-path-planner?filename=package.json&label=version)](package.json)
[![Dependencies](https://img.shields.io/badge/dependencies-pnpm%20workspace-ffb703?logo=pnpm&logoColor=white)](pnpm-workspace.yaml)
[![Container Publish](https://img.shields.io/badge/GHCR-publish%20enabled-003f8c?logo=docker&logoColor=white)](https://github.com/users/Sjolus/packages?repo_name=yet-another-path-planner)
[![License](https://img.shields.io/badge/license-CC--BY--NC--ND%204.0-orange)](LICENSE)

## Overview

Yet Another Path Planner helps flight simulation enthusiasts plan and manage their virtual flying careers by creating organized flight tours and tracking progress through them.

## Features

- **Find Flight Tours**: Discover interesting flight routes and tour options
- **Create Custom Tours**: Design your own multi-leg flight tours
- **Track Progress**: Monitor your career progression through planned tours
- **Flight Simulation Integration**: Built with popular flight simulation platforms in mind

## Purpose

This tool is designed for flight simulation pilots who want to add structure and purpose to their virtual flying experience, whether you're recreating historical routes, exploring new regions, or building a comprehensive flying career.

## Status

This project is currently in development. The project skeleton is complete with a fully functional monorepo setup.

Automated coverage reporting is planned; the badge above will switch from "coming soon" once the Codecov workflow ships.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

For detailed setup instructions, see [`docs/onboarding.md`](docs/onboarding.md).

## Architecture & Monorepo Plan

The high-level component plan—including the proposed monorepo layout, technology choices, CI/CD flow, and Kubernetes deployment strategy—is documented in `docs/architecture.md`. Start there when evaluating how the frontend, backend, infrastructure, and operational tooling fit together. Detailed local setup instructions are tracked in `docs/onboarding.md`.

## AI Agent Guidelines

This repository is configured with comprehensive instructions for GitHub Copilot and other AI coding agents:

- **`.github/copilot-instructions.md`** - Main collaboration guidelines for AI agents
- **`.github/instructions/*.instructions.md`** - Path-specific instructions for different components
- **`.github/copilot-setup-steps.yml`** - Pre-installation steps for Copilot's environment
- **`AGENTS.md`** - Documentation for creating custom specialized agents
- **`CLAUDE.md`** - Quick reference for Claude and AI assistants

These files ensure AI agents understand the project structure, follow best practices, and maintain code quality.

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](LICENSE) license.
