# Konda OS Engineering Constitution

## Project Identity

Project Name: Konda OS

Mission:

Konda OS is a local-first, AI-native operating system and workspace designed to help people learn, create, build, and automate using open technologies.

The project prioritizes modular architecture, extensibility, privacy, and long-term maintainability.

---

# Core Principles

1. Local First

Always prefer local AI, local storage, and local execution whenever practical.

Cloud services must be optional.

---

2. AI Native

AI is part of the operating system.

It is never treated as a separate chatbot.

Every feature should consider AI integration.

---

3. Human First

The user always remains in control.

AI assists.

AI never silently performs destructive actions.

---

4. Modular

Every subsystem must be replaceable.

Never tightly couple modules.

Use interfaces and dependency injection.

---

5. Future Ready

Do not design for today's models only.

Support future providers without architecture changes.

Never hardcode AI model names.

Use registries and providers.

---

# Architecture

The architecture is frozen unless approved.

Application

↓

Bootstrap

↓

Kernel

↓

Service Container

↓

Modules

↓

UI

Never bypass this architecture.

---

# Kernel

The Kernel owns all shared services.

Examples:

- Event Bus
- Service Container
- Scheduler
- Workflow Engine
- Workspace Manager
- Memory Manager
- AI Router
- Tool Manager

Feature modules must never create duplicate instances.

Never call:

new EventBus()

new WorkspaceManager()

new MemoryManager()

Instead resolve services from the Service Container.

---

# Dependency Injection

Prefer constructor injection.

Never create global singletons inside feature modules.

All shared services are registered by the Application during startup.

---

# Event System

The application uses one shared Event Bus.

Modules communicate through events whenever appropriate.

Avoid direct module-to-module dependencies.

---

# Workspace

Workspace is the single source of truth.

Workspace stores:

- Active project
- Active file
- Open editors
- Selected text
- Terminal state
- Git branch
- Context

AI must obtain workspace information through the Workspace Manager.

---

# AI Architecture

AI Chat

↓

AI Orchestrator

↓

Konda Intelligence Layer

↓

Router

↓

Provider

↓

Model

Never connect UI directly to AI providers.

---

# AI Providers

Providers must be interchangeable.

Support examples:

- Ollama
- LM Studio
- llama.cpp
- vLLM

Future providers must require minimal changes.

---

# AI Models

Never hardcode models.

Use a Model Registry.

Every model should include metadata.

Example:

- id
- provider
- capabilities
- context length
- vision support
- reasoning support
- local/cloud

---

# Folder Rules

core/

Shared infrastructure.

features/

Application features.

components/

Reusable UI.

services/

External integrations.

docs/

Documentation.

tests/

Tests.

Never place business logic inside UI components.

---

# TypeScript

Always use strict mode.

Avoid any.

Prefer interfaces.

Prefer explicit return types on public APIs.

Never disable TypeScript errors.

---

# React

Prefer functional components.

Prefer hooks.

Keep components focused.

Move business logic into services.

---

# Electron

Keep renderer isolated.

Use preload.

Use IPC safely.

Never expose Node.js directly to the renderer.

Follow Electron security best practices.

---

# Performance

Lazy load when appropriate.

Avoid unnecessary renders.

Prefer asynchronous operations.

Avoid blocking the UI thread.

---

# Security

Validate IPC messages.

Validate user input.

Never expose secrets.

Never commit API keys.

Follow least-privilege principles.

---

# Testing

Every feature should eventually include:

- Unit tests
- Integration tests
- Playwright E2E tests

Application should build successfully before merging.

---

# Documentation

Every major subsystem should have documentation.

Keep docs synchronized with architecture.

---

# Code Review Checklist

Before considering a feature complete:

- Compiles
- Builds
- No TypeScript errors
- No ESLint errors
- No duplicate logic
- No circular dependencies
- Uses dependency injection
- Uses shared services
- Matches architecture
- Documented

---

# AI Assistant Rules

When generating code:

Never redesign the architecture.

Never move files unless requested.

Never duplicate managers.

Never duplicate services.

Never bypass the Service Container.

Never create unnecessary dependencies.

Never introduce paid services without approval.

Prefer local-first solutions.

Maintain backward compatibility whenever practical.

Generate production-quality code.

Explain architectural decisions when introducing new patterns.

If uncertain, ask rather than guessing.

---

# Long-Term Vision

Konda OS is intended to evolve into an intelligent operating system and workspace.

Future capabilities include:

- Multi-agent workflows
- Memory engine
- Automation engine
- Plugin SDK
- Learning mode
- Research mode
- Visual workflow builder
- Offline-first AI ecosystem

All code should support this long-term direction without requiring major rewrites.