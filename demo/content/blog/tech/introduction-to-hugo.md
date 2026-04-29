---
title: "Introduction to Hugo"
description: "A beginner's guide to Hugo — the world's fastest static site generator"
date: 2026-01-15T10:00:00Z
author: "John Developer"
tags: ["hugo", "ssg", "tutorial"]
---

{{< terminal-image src="https://picsum.photos/seed/hugointro/800/400" alt="Hugo logo concept with terminal aesthetic" caption="Speed meets simplicity — welcome to Hugo" >}}

Every time I rebuild this site, it takes roughly {{< colored-text color="#b8bb26" >}}12 milliseconds{{< /colored-text >}}. Not seconds. Milliseconds. That's Hugo — a static site generator written in Go that transforms Markdown content and templates into pure HTML in the time it takes most frameworks to decide which config file to read.

{{< terminal-link url="https://gohugo.io" >}}Hugo{{< /terminal-link >}} is not just fast. It's a complete framework for building websites of any scale — from personal blogs to corporate documentation to entire marketing sites — all without a single runtime dependency. No Node.js. No database. No server-side processing at request time.

## Why Hugo?

{{< terminal-table >}}
Benefit | Why It Matters
Blazing Fast Builds | Hugo builds thousands of pages in seconds. Instant feedback during development and near-instant deploys in CI/CD.
Single Binary | Hugo is a single, self-contained executable with zero dependencies. Download, unzip, and run.
Built-in Features | Asset pipeline (SCSS, JS bundling), i18n, taxonomies, content templates, RSS, sitemaps — all included.
No Runtime | Static HTML means no server-side processing, no database queries, no security surface area at request time.
Markdown-First | Write content in Markdown with front matter. Git-friendly, portable, and future-proof.
{{< /terminal-table >}}

{{< colored-text color="#fabd2f" >}}The terminal theme powering this site is a testament to Hugo's flexibility.{{< /colored-text >}} It uses custom output formats for HTMX fragments, recursive partials for site tree generation, and a modular SCSS pipeline — all without leaving Hugo's built-in tooling.

## Key Concepts

### Content Organization

Hugo organizes content into **sections** (directories) and **pages** (Markdown files). A section is any directory containing an `_index.md` file. This structure maps directly to URLs:

```
content/
├── _index.md            →  /
├── blog/
│   ├── _index.md        →  /blog/
│   ├── tech/
│   │   ├── _index.md    →  /blog/tech/
│   │   └── article.md   →  /blog/tech/article/
│   └── lifestyle/
│       └── post.md      →  /blog/lifestyle/post/
└── about.md             →  /about/
```

### Front Matter

Every Markdown file starts with YAML front matter that defines metadata:

```yaml
---
title: "Introduction to Hugo"
description: "A beginner's guide to Hugo"
date: 2026-01-15T10:00:00Z
author: "John Developer"
tags: ["hugo", "ssg", "tutorial"]
draft: false
---
```

Front matter fields like {{< colored-text color="#83a598" >}}title{{< /colored-text >}}, {{< colored-text color="#83a598" >}}date{{< /colored-text >}}, {{< colored-text color="#83a598" >}}tags{{< /colored-text >}}, and {{< colored-text color="#83a598" >}}draft{{< /colored-text >}} are first-class citizens in Hugo. Custom fields are accessible via `.Params` in templates.

### Templates and Layouts

Hugo uses Go templates with a lookup order that cascades from specific to generic:

```
layouts/
├── _default/
│   ├── baseof.html      →  Base skeleton (HTML, head, body)
│   ├── single.html      →  Default template for pages
│   └── list.html        →  Default template for sections
├── blog/
│   └── single.html      →  Override for blog posts
└── partials/
    ├── header.html
    └── footer.html
```

### Shortcodes

Shortcodes are Hugo's answer to reusable components — small template snippets you call from Markdown:

```markdown
{{</* terminal-link url="https://gohugo.io" */>}}Hugo Website{{</* /terminal-link */>}}
```

This theme provides four shortcodes: `colored-text`, `terminal-link`, `terminal-image`, and `terminal-table`. See the {{< terminal-link url="/docs/getting-started" >}}Getting Started guide{{< /terminal-link >}} for the full reference.

### Partials

Partials are reusable template snippets stored in `layouts/partials/`. They can call each other recursively — which is exactly how this theme generates the site tree JSON that powers the virtual filesystem:

```go-html-template
{{ partial "site-tree-children.html" (dict "page" . "pages" .Pages) }}
```

## Quick Start Guide

Get a Hugo site running in five minutes:

1. **Install Hugo Extended** — Download from {{< terminal-link url="https://gohugo.io/installation/" >}}hugo.io/installation{{< /terminal-link >}}. Verify with `hugo version` — you need Extended edition for SCSS support.

2. **Create a new site**
   ```bash
   hugo new site my-site
   cd my-site
   ```

3. **Add a theme**
   ```bash
   git init
   git submodule add https://github.com/username/theme.git themes/my-theme
   ```

4. **Configure** in `hugo.yaml`:
   ```yaml
   baseURL: "https://example.com"
   languageCode: "en-us"
   title: "My Site"
   theme: "my-theme"
   ```

5. **Add content**
   ```bash
   hugo new blog/my-first-post.md
   ```

6. **Run the dev server**
   ```bash
   hugo server -D
   ```

7. **Build for production**
   ```bash
   hugo
   ```
   Your static site is now in the `public/` directory, ready to deploy anywhere.

### Directory Structure

{{< terminal-table >}}
Directory/File | Purpose
`content/` | All your Markdown content, organized by section
`layouts/` | HTML templates that define how content is rendered
`assets/` | SCSS, JS, and other processing pipeline assets
`static/` | Raw files served as-is (images, fonts, downloads)
`hugo.yaml` | Site configuration and theme parameters
`theme.yaml` | Theme metadata (name, version, min Hugo version)
{{< /terminal-table >}}

## Where to Go Next

- {{< terminal-link url="https://gohugo.io/documentation/" >}}Official Hugo Documentation{{< /terminal-link >}} — Comprehensive and well-organized
- {{< terminal-link url="https://themes.gohugo.io/" >}}Hugo Themes{{< /terminal-link >}} — Browse hundreds of community themes
- {{< terminal-link url="https://discourse.gohugo.io/" >}}Hugo Forums{{< /terminal-link >}} — Active community support

{{< colored-text color="#8ec07c" >}}This entire site{{< /colored-text >}} — the terminal interface, the HTMX-powered navigation, the recursive site tree, the lightbox, the theme switcher — is built with Hugo and rendered statically. No JavaScript frameworks. No build tooling beyond Hugo itself. If you're coming from the world of React SPAs, Hugo will feel like a breath of fresh air. If you're new to static sites entirely, welcome — you're in for a treat.
