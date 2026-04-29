---
title: "HTMX Patterns"
description: "Practical patterns for building hypermedia-driven applications without the framework tax"
date: 2026-02-20T14:30:00Z
author: "John Developer"
tags: ["htmx", "frontend", "patterns"]
---

{{< terminal-image src="https://picsum.photos/seed/htmxheader/800/400" alt="HTMX diagram showing hypermedia exchanges" caption="Hypermedia in action — HTML over the wire" >}}

For the last decade, frontend development has been dominated by a single paradigm: heavy JavaScript frameworks that ship a runtime to the browser, manage state on the client, and communicate with the server via JSON APIs. It works, but it comes with a cost — bundle sizes, build tooling, API versioning, and a cognitive load that grows with every abstraction.

{{< terminal-link url="https://htmx.org" >}}HTMX{{< /terminal-link >}} offers a different path. Instead of bringing the application logic to the client, it extends HTML with attributes that let you trigger AJAX requests, handle responses, and update the DOM — all directly from markup. The result is applications that feel modern and interactive but are built with the simplicity of server-rendered HTML.

{{< colored-text color="#8ec07c" >}}HTMX is not a new framework. It's a return to the original architecture of the web — just with better ergonomics.{{< /colored-text >}}

## Key Concepts

HTMX exposes the full power of AJAX, WebSockets, and Server-Sent Events directly in HTML. The core is a set of attributes that define how elements interact with the server.

{{< terminal-table >}}
Attribute | Purpose | Example
`hx-get` | Fetch content from the server via GET | `hx-get="/api/posts"` loads posts
`hx-post` | Submit data to the server via POST | `hx-post="/api/contact"` submits a form
`hx-target` | CSS selector specifying where to swap the response | `hx-target="#content"` puts response into `#content`
`hx-swap` | Controls how the response replaces the target | `hx-swap="outerHTML"` replaces the target entirely
`hx-trigger` | Defines the event that triggers the request | `hx-trigger="click"` fires on click (default for links)
`hx-delete` | Send a DELETE request | `hx-delete="/api/posts/1"` deletes a resource
`hx-put` | Send a PUT request for updates | `hx-put="/api/posts/1"` updates a resource
`hx-push-url` | Push a URL into the browser history | `hx-push-url="true"` updates the address bar
{{< /terminal-table >}}

The magic is in the {{< colored-text color="#fabd2f" >}}hx-swap{{< /colored-text >}} attribute. It controls exactly how the response HTML is placed into the DOM:

- `innerHTML` — Replace the target's content (default)
- `outerHTML` — Replace the target element itself
- `afterbegin` / `beforebegin` — Insert relative to the target
- `beforeend` / `afterend` — Append/prepend relative to the target
- `none` — Don't swap (useful for side effects)

## Common Patterns

### Click-to-Load

One of the simplest and most useful patterns. A button that loads additional content when clicked:

```html
<button hx-get="/posts?page=2"
        hx-target="#post-list"
        hx-swap="beforeend">
  Load More Posts
</button>
```

Each click loads the next page of posts and appends them to `#post-list`. No JavaScript required. The server returns HTML fragments, not JSON.

### Infinite Scroll

An enhancement of click-to-load, triggered by scroll position rather than a button click:

```html
<div hx-get="/posts?page=2"
     hx-trigger="revealed"
     hx-target="this"
     hx-swap="afterend">
  Loading more posts...
</div>
```

The `revealed` trigger fires when the element scrolls into view. HTMX then fetches the next page and inserts it after the current element — which becomes the new sentinel for the next trigger. {{< colored-text color="#b8bb26" >}}This creates a self-perpetuating infinite scroll with zero JavaScript.{{< /colored-text >}}

### Inline Editing

Double-click a field to turn it into an editable input:

```html
<div hx-get="/post/1/edit"
     hx-trigger="dblclick"
     hx-target="this"
     hx-swap="innerHTML">
  Original content here...
</div>
```

The server returns an HTML form fragment. When the form is submitted, the server returns the updated content:

```html
<form hx-put="/post/1"
      hx-target="this"
      hx-swap="outerHTML">
  <input name="content" value="{{ .Content }}">
  <button type="submit">Save</button>
</form>
```

### Modal Dialogs

Load modal content into a shared dialog container:

```html
<button hx-get="/post/1/details"
        hx-target="#modal-content"
        hx-trigger="click">
  View Details
</button>

<div id="modal" class="modal hidden">
  <div id="modal-content"></div>
  <button onclick="closeModal()">Close</button>
</div>
```

The server returns HTML for the modal body. A small CSS class toggle handles showing and hiding. {{< colored-text color="#fe8019" >}}No JSON. No client-side templates. Just HTML returned from the server.{{< /colored-text >}}

## HTMX vs SPA Frameworks

{{< terminal-table >}}
Aspect | HTMX | SPA Frameworks (React, Vue, Svelte)
Architecture | Server-rendered HTML over the wire | Client-rendered with JSON API layer
Bundle Size | ~14KB minified (zero dependencies) | 30KB–200KB+ with runtime
Build Tooling | None required | Webpack, Vite, Babel, etc.
State Management | Server is source of truth | Client stores + API synchronization
Learning Curve | HTML attributes (one afternoon) | Components, hooks, lifecycle, routing, stores
Accessibility | Built-in (semantic HTML) | Requires deliberate effort
SEO | Full server-rendered pages | Requires SSR/SSG workarounds
{{< /terminal-table >}}

{{< colored-text color="#83a598" >}}HTMX is not a replacement for all SPAs.{{< /colored-text >}} For highly interactive client-side applications (like a code editor or design tool), a SPA framework is still the right choice. But for the vast majority of web applications — dashboards, blogs, e-commerce, content management, social feeds, documentation — HTMX provides a simpler, more maintainable, and more resilient architecture.

## When to Use HTMX

The sweet spot for HTMX is applications where:

- Most pages are content-heavy and server-rendered
- You want interactive behaviors (forms, pagination, search, modals) without a full SPA
- You're already rendering HTML on the server (in Go, Python, Ruby, PHP, etc.)
- You value simplicity and resilience over maximal client-side interactivity

{{< colored-text color="#b8bb26" >}}The terminal theme you're reading this on uses HTMX for all navigation — directory listings, content loading, and command execution all happen via HTML fragments. One afternoon of work, zero KB of framework JavaScript.{{< /colored-text >}}

For more patterns and the full documentation, visit {{< terminal-link url="https://htmx.org/docs/" >}}HTMX Documentation{{< /terminal-link >}}.
