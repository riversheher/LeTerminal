---
title: "Getting Started"
description: "Complete guide to installing, configuring, and customizing your terminal portfolio theme"
author: "John Developer"
updated: 2026-04-29
---

Welcome to the Getting Started guide. This document will walk you through everything you need to set up the terminal portfolio theme, from prerequisites to advanced customization.

{{< terminal-image src="https://picsum.photos/seed/gettingstarted/800/400" alt="Terminal theme in action" caption="The terminal portfolio — your command center" >}}

## Prerequisites

Before you begin, make sure you have the following installed:

- {{< colored-text color="#83a598" >}}Hugo Extended{{< /colored-text >}} version {{< colored-text color="#fabd2f" >}}0.160.0{{< /colored-text >}} or later. The extended edition is required for SCSS/SASS processing and asset pipeline features. You can check your version with `hugo version`.
- {{< colored-text color="#8ec07c" >}}Git{{< /colored-text >}} for cloning the repository and managing updates.
- A modern web browser (Chrome, Firefox, Safari, or Edge) for previewing the development server.

## Installation

Follow these steps to get the theme running locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/terminal-portfolio.git
   cd terminal-portfolio
   ```

2. **Navigate to the demo site**
   ```bash
   cd demo
   ```

3. **Start the development server**
   ```bash
   hugo server -D
   ```
   This starts a local server at `http://localhost:1313/` with draft content included (`-D` flag).

4. **Open in your browser**
   Navigate to `http://localhost:1313/` to see the terminal in action. Type `help` at the prompt to see available commands.

{{< colored-text color="#b8bb26" >}}Tip:{{< /colored-text >}} Use `hugo server -D --disableFastRender` when making layout changes to prevent stale fragment caching.

## Configuration

The main configuration file is `demo/hugo.yaml`. Here are the key configuration sections:

### Profile Settings

{{< terminal-table >}}
Field | Description | Example
`params.profileName` | Display name on the profile card | `John Developer`
`params.profileSubtitle` | Tagline below the name | `Full Stack Developer`
`params.profileBio` | Short biography text | `Building elegant solutions...`
`params.profileInitials` | Initials for the avatar fallback | `JD`
`params.profileImage` | Path to profile image | `images/profile.jpg`
{{< /terminal-table >}}

### Command Configuration

Add or customize commands under `params.commands`. Each command has a {{< colored-text color="#83a598" >}}name{{< /colored-text >}} (the command word to type), {{< colored-text color="#83a598" >}}label{{< /colored-text >}} (display text), and {{< colored-text color="#83a598" >}}description{{< /colored-text >}} (shown in help and suggestions):

```yaml
params:
  commands:
    - name: "about"
      label: "about"
      description: "Learn more about me"
    - name: "projects"
      label: "projects"
      description: "View my projects"
```

### Color Customization

Override theme colors by uncommenting and editing the `colors` section:

```yaml
params:
  colors:
    dark:
      pageBg: "#0a0e1a"
      termFg: "#ebdbb2"
      termRed: "#fb4934"
      termGreen: "#b8bb26"
    light:
      pageBg: "#fbf1c7"
      termFg: "#3c3836"
```

{{< colored-text color="#fe8019" >}}Note:{{< /colored-text >}} Hugo lowercases config keys, so use `.Params` access with `| default` fallbacks.

### Background Images

Configure different backgrounds for dark and light modes:

```yaml
params:
  background:
    image: "images/default.png"
    darkImage: "images/dark-mode.png"
    lightImage: "images/light-mode.png"
```

## Adding Content Pages

One of the theme's most powerful features is automatic command registration. Simply create a new Markdown file in the `content/` directory:

1. **Create a leaf page** at `demo/content/my-page.md`:
   ```markdown
   ---
   title: "My Page"
   description: "Description of my page"
   ---
   Content goes here...
   ```

2. **Rebuild or restart** the dev server. The page automatically becomes navigable:
   - Typing `my-page` at the terminal loads its fragment content via HTMX
   - It appears in `ls` output as a `file` entry
   - It shows up in the help listing and autocomplete suggestions

## Adding Sections (Directories)

To create a navigable directory with child pages:

1. **Create a directory** with a `_index.md`:
   ```
   demo/content/
   └── my-section/
       ├── _index.md
       ├── article-one.md
       └── article-two.md
   ```

2. The `_index.md` file requires front matter (at minimum a {{< colored-text color="#83a598" >}}title{{< /colored-text >}}). Its body content renders as an intro block above the directory listing.

3. Typing `my-section` acts as `cd my-section`, loading the section's fragment page and making its children available as commands.

### Content Structure Example

{{< terminal-table >}}
Path | Type | Registration
`content/about.md` | Leaf page | Command `about` loads the page content
`content/blog/_index.md` | Section | Command `blog` navigates into the directory
`content/blog/post.md` | Leaf page | Command `post` available inside `blog/`
`content/docs/commands.md` | Leaf page | Command `commands` available inside `docs/`
{{< /terminal-table >}}

## Shortcodes Reference

The theme provides four custom shortcodes for rich content formatting.

### 1. Colored Text

Wraps text in a colored span using any hex color value. Uses the Gruvbox-inspired palette by default.

```markdown
{{</* colored-text color="#b8bb26" */>}}Green success message{{</* /colored-text */>}}
```

{{< colored-text color="#b8bb26" >}}Green success message{{< /colored-text >}}

### 2. Terminal Link

Creates a styled hyperlink that opens in a new tab with `rel="noopener noreferrer"`.

```markdown
{{</* terminal-link url="https://gohugo.io" */>}}Hugo Website{{</* /terminal-link */>}}
```

### 3. Terminal Image

Displays an image with the terminal aesthetic, including optional scanline overlay and max-width constraint.

{{< terminal-table >}}
Parameter | Required | Default | Description
`src` | Yes | — | Image URL (relative or absolute)
`alt` | No | `""` | Alt text for accessibility
`caption` | No | `alt` value | Caption displayed below the image
`scanline` | No | `false` | Enables CRT scanline overlay effect
`maxWidth` | No | `""` | CSS max-width value (e.g., `600px`)
{{< /terminal-table >}}

```markdown
{{</* terminal-image src="https://picsum.photos/seed/example/600/300" alt="Example image" caption="A placeholder image" scanline="true" maxWidth="600px" */>}}
```

{{< terminal-image src="https://picsum.photos/seed/example/600/300" alt="Example image" caption="A placeholder image with scanline effect" scanline="true" maxWidth="600px" >}}

### 4. Terminal Table

Creates a two-column terminal-style layout. Use `|` as the delimiter between columns and newlines for rows.

```markdown
{{</* terminal-table */>}}
Command | Description
`cd`    | Change directory
`ls`    | List contents
`pwd`   | Print working directory
{{</* /terminal-table */>}}
```

{{< terminal-table >}}
Command | Description
`cd` | Change directory
`ls` | List contents
`pwd` | Print working directory
{{< /terminal-table >}}

## Troubleshooting

Here are solutions to common issues:

{{< terminal-table >}}
Problem | Solution
Fragment content not updating | Use `--disableFastRender` flag when running `hugo server`
SCSS build errors | Make sure you're using Hugo **Extended** edition (`hugo version`)
Images not loading | Verify image paths are correct and files exist in `static/` or use absolute URLs
Commands not appearing | Ensure the page has a `_index.md` with front matter for directory sections
Theme name mismatch | The theme directory name and `hugo.yaml` theme field must match exactly
{{< /terminal-table >}}

If you're still stuck, check the {{< terminal-link url="https://gohugo.io/documentation/" >}}Hugo documentation{{< /terminal-link >}} or open an issue in the theme repository.
