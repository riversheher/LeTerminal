# Le Terminal

A linux desktop, terminal inspired theme for use with Hugo.

A balance between the terminal system model, and features for user experience and readability.

## Key Features
- Autoscrolling text
- Swap between click based and text input based interfaces.
- Blog
- User defined categories
- Fully HUGO, no backend required.

## Key Design Considerations

- Ensure that the design is very easily identified as a terminal.
    - All content is within the confines of the terminal window.
- Support images within the terminal window without breaking the terminal model.
- Support paginated blog
- Markdown files used as content base, generated partials, and html
- Dynamically fetch content through HTMX without pageload
- Fetched content printed in terminal window, autoscrolled, history can be viewed by scrolling up.
- Homepage content persists after terminal clear command.

# Dependencies
- Hugo **v0.146.0+** (extended edition)
- HTMX 2.0.8 (bundled with theme)

---

# Installation

## 1. Install Hugo

Install Hugo **extended** edition v0.146.0 or later — [gohugo.io/installation](https://gohugo.io/installation/).

```bash
hugo version 
```

## 2. Create a New Site

```bash
hugo new site my-site && cd my-site
```

## 3. Add the Theme as a Git Submodule

```bash
git init
git submodule add https://github.com/riversheher/LeTerminal.git themes/LeTerminal
```

To update the theme later:

```bash
git submodule update --remote themes/LeTerminal
```

## 4. Configure Your Site

Set `theme` in `hugo.yaml` and add the required `outputs` block:

```yaml
baseURL: "https://yoursite.com/"
title: "My Terminal"
theme: "LeTerminal"             # Must match the themes/ folder name

# Required — enables HTMX fragment rendering
outputs:
  home:
    - HTML
  page:
    - HTML
    - fragment
```

# Start the dev server
hugo server -D

Open [http://localhost:1313](http://localhost:1313).

See the full configuration reference in the Content Authoring Guide below.

---

# Content Authoring Guide

## Site Configuration

In your site's `hugo.yaml`:

```yaml
baseURL: "https://yoursite.com/"
title: "Portfolio Terminal"
theme: "LeTerminal"

params:
  # -- Terminal chrome --------------------------------------------------------
  terminalTitle: "user@host:~"        # Text shown in the terminal title bar

  # -- Profile card (displayed on homepage) -----------------------------------
  siteName: "Portfolio Terminal"       # Welcome banner name
  siteVersion: "v1.0.0"               # Version shown beside site name
  profileName: "Your Name"            # Large heading in profile card
  profileSubtitle: "Your Tagline"     # Subtitle under your name
  profileBio: "A short bio."          # Paragraph below the subtitle
  profileInitials: "YN"               # Fallback avatar when no image is set
  # profileImage: "/images/profile.jpg" # Uncomment to use an image avatar

  # -- Commands (each entry becomes a clickable/typeable command) -------------
  commands:
    - name: "help"                    # URL slug (must match content filename)
      label: "help"                   # Display text in command bar
      description: "Show help"        # Tooltip / help text
    - name: "about"
      label: "about"
      description: "Learn more about me"

  # -- Colour overrides (optional) --------------------------------------------
  # Override individual theme colours per mode. See theme hugo.yaml for all keys.
  # colors:
  #   dark:
  #     termBg: "#1d2021"
  #     termText: "#ebdbb2"
  #   light:
  #     termBg: "#fbf1c7"
  #     termText: "#3c3836"

  # -- Background image (optional) --------------------------------------------
  # background:
  #   image: "/images/bg.jpg"           # Shared fallback
  #   darkImage: "/images/bg-dark.jpg"  # Dark-mode only
  #   lightImage: "/images/bg-light.jpg"

```

## Adding a Page

1. Create a Markdown file in `content/` — the filename becomes the command/slug:

```
content/
  _index.md      # Homepage (title only, body not rendered)
  help.md        # /help
  about.md       # /about
  projects.md    # /projects
```

2. Add front matter. Only `title` is required:

```yaml
---
title: "about"          # Displayed as the echoed command  ($ about)
author: "Your Name"     # Optional — shown in content footer
created: 2026-01-10     # Optional — creation date in footer
updated: 2026-04-15     # Optional — last-updated date in footer
---
```

3. Register the page as a command in `hugo.yaml` → `params.commands` so it appears in the command bar and is reachable by typing.

4. Write content using standard Markdown — headings, lists, tables, bold/italic all work.

## Shortcodes

Use these inside your Markdown files for terminal-styled elements.

### Colored Text
```markdown
{{</* colored-text color="#b8bb26" */>}}Green text{{</* /colored-text */>}}
```

### Terminal Link
```markdown
{{</* terminal-link url="https://github.com" */>}}GitHub{{</* /terminal-link */>}}
```

### Terminal Image
```markdown
{{</* terminal-image src="/images/demo.png" alt="Demo" */>}}

<!-- Optional parameters: -->
{{</* terminal-image src="/images/demo.png" alt="Demo" caption="A caption" scanline="true" maxWidth="400px" */>}}
```

### Terminal Table
Pipe-separated two-column layout:
```markdown
{{</* terminal-table */>}}
**Frontend:** | **Backend:**
React, TypeScript | Node.js, Python
Next.js, Vue.js | Go, Gin
{{</* /terminal-table */>}}
```