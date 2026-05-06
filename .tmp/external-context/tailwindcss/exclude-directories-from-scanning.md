---
source: Official Tailwind CSS Docs (tailwindcss.com) + Context7 API
library: Tailwind CSS
package: tailwindcss
topic: Excluding directories from content scanning (v4)
fetched: 2026-05-06T14:30:00Z
official_docs: https://tailwindcss.com/docs/detecting-classes-in-source-files
---

# Tailwind CSS v4: Excluding Directories from Content Scanning

## The Problem

Tailwind CSS v4 automatically scans **all project files** for utility class names — except files listed in `.gitignore`, `node_modules`, binaries, CSS files, and lock files. It does **not** ignore hidden directories (`.agents/`, `.git/`, `.vscode/`, etc.) by default.

When it scans markdown files containing examples like `bg-[url('...')]`, it may try to resolve the `...` as a real file path in arbitrary value processing, causing a build error like:
> **"Module not found: Can't resolve '...'"**

## Solution 1: Add the Directory to `.gitignore` (Recommended)

Tailwind v4 **automatically respects `.gitignore`**. If you add the problematic directory to `.gitignore`, Tailwind will skip it entirely.

```
.agents/
```

**Why this works:** The official docs state: *"Tailwind will scan every file in your project for class names, except in the following cases: Files that are in your `.gitignore` file."*

This is the simplest and most reliable approach.

## Solution 2: `@source not` Directive (v4.1+)

Use `@source not` in your main CSS file to exclude specific paths **relative to the stylesheet**:

```css
@import "tailwindcss";
@source not "../.agents";
```

**Important:** In some Tailwind v4 versions prior to 4.1, `@source not` may not be available. Check that you're on v4.1 or later.

**If the path above doesn't work**, try with a leading `./`:

```css
@import "tailwindcss";
@source not "./.agents";
```

Or with an absolute-style path depending on your CSS file location relative to project root:

```css
@import "tailwindcss";
@source not "../../.agents";  /* if CSS is deeper, e.g., app/styles/ */
```

## Solution 3: Disable Automatic Detection Entirely

Use `source(none)` to disable all automatic source detection, then explicitly register only the directories you want to scan:

```css
@import "tailwindcss" source(none);
@source "../app";
@source "../components";
@source "../lib";
```

This gives you precise control over what gets scanned.

## Solution 4: Scope `@source` to Only Your Source Directories

Instead of excluding what you don't want, explicitly include only what you do want while keeping auto-detection:

```css
@import "tailwindcss";
@source "../app";
@source "../components";
@source "../lib";
```

> **Note:** Unlike `source(none)`, this still also scans auto-detected paths. You must use `source(none)` for exclusive control.

## Understanding Path Resolution

The `@source` and `@source not` paths are **relative to the location of the CSS file** where the directive is written, NOT relative to the project root. For example:

- If CSS is at `app/globals.css`: `@source not "../.agents"` resolves to project root level
- If CSS is at `src/styles/main.css`: `@source not "../../.agents"` resolves to project root level

## Version Compatibility

| Feature | Minimum Version |
|---------|----------------|
| `@source` (explicit include) | v4.0 |
| `@source not` (exclude paths) | v4.1 |
| `source(none)` | v4.0 |
| `source("../path")` (base path) | v4.0 |
| Auto `.gitignore` detection | v4.0 |

## Summary

| Approach | Best For |
|----------|----------|
| Add to `.gitignore` | Hidden dirs like `.agents/`, `.vscode/`, etc. — simplest solution |
| `@source not` | Excluding specific dirs without changing gitignore (v4.1+) |
| `source(none)` + explicit `@source` | Full control, multi-stylesheet projects |
