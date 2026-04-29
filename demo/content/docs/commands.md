---
title: "Commands Reference"
description: "Complete reference for all terminal commands, keyboard shortcuts, and command precedence"
author: "John Developer"
updated: 2026-04-29
---

The terminal portfolio operates on a simple but powerful command system. Every action — navigating directories, loading content, and managing your session — happens through typed commands. This reference documents every command available, explains how they interact, and covers the keyboard shortcuts that make navigation fast and fluid.

{{< terminal-image src="https://picsum.photos/seed/commandsdemo/800/400" alt="Terminal showing various commands in action" caption="Commands in action — ls, cd, and help at work" >}}

## Navigation Commands

The core navigation commands let you move through the virtual filesystem just like a real shell. These are built-in and available at all times, regardless of configuration or content.

{{< terminal-table >}}
Command | Description
`cd <dir>` | Change into a subdirectory. Loads the directory's fragment content via HTMX and updates the hash. For example, `cd blog` takes you to the blog section.
`ls` | List children of the current directory. Shows directories with a trailing `/` and files as plain entries.
`pwd` | Print the current working directory path. Displays the virtual path from root (e.g., `/blog/tech`).
`back` | Go up one directory. Reverses the last `cd` operation and restores the previous directory listing.
`reset` | Return to the root directory. Clears all dynamic content, resets the hash, and brings you back to the homepage.
`clear` | Clear the terminal output. Keeps your current directory and state but wipes the visible scrollback.
{{< /terminal-table >}}

{{< colored-text color="#b8bb26" >}}Pro tip:{{< /colored-text >}} You can chain `cd` with a path like `cd blog/tech` to jump directly to a nested directory in one step.

## Content Commands

Content pages and sections are automatically registered as commands based on the Hugo content tree. When you create a new `.md` file under `content/`, it becomes a navigable command automatically — no configuration needed.

- Typing the name of a **section** (directory) acts as `cd <name>`, loading that section's index page and making its children available.
- Typing the name of a **leaf page** loads its fragment content directly into the terminal output area, rendered with full formatting and shortcodes.

For example, if you have a file at `content/projects.md`, typing `projects` at the root prompt loads its content. If you have a directory at `content/blog/tech/_index.md`, typing `tech` from within `blog/` navigates into that section.

{{< colored-text color="#fe8019" >}}Note:{{< /colored-text >}} Tree commands are dynamically registered and unregistered as you navigate. Only the commands relevant to your current directory are available at any given time.

## Config Commands

Commands defined in `hugo.yaml` under `params.commands` are static — they are always available regardless of your current directory or the state of the content tree.

These are useful for:
- Pages that exist outside the content tree
- Providing custom descriptions for auto-discovered commands
- Controlling the order of commands in the static command bar

Config commands take priority over tree commands of the same name, which means you can override an auto-registered command's description or behavior by adding it to `params.commands`.

## Command Precedence

When multiple sources define the same command name, the following precedence determines which one wins:

{{< terminal-table >}}
Priority | Source | Example
1 (Highest) | Builtins | `help`, `clear`, `cd`, `ls`, `pwd`, `back`, `reset`
2 | Config Commands | Commands defined in `hugo.yaml` `params.commands`
3 (Lowest) | Tree Commands | Auto-discovered from content tree
{{< /terminal-table >}}

This means you can never accidentally override built-in commands like `cd` or `ls`. Config commands provide a controlled override mechanism for tree commands, giving you flexibility while maintaining system stability.

## Keyboard Shortcuts

The terminal supports a full keyboard-driven workflow. These shortcuts work wherever the command input is focused:

{{< terminal-table >}}
Shortcut | Action
`Tab` | Tab completion — cycles through matching commands. Press repeatedly to cycle through all available completions.
`Shift + Tab` | Reverse tab completion — cycles backward through matches.
`Up Arrow` | Previous command in history. Press repeatedly to scroll back through your session history.
`Down Arrow` | Next command in history. Scrolls forward after using Up Arrow.
`Enter` | Execute the typed command.
`Escape` | Close suggestions dropdown if open.
{{< /terminal-table >}}

{{< colored-text color="#8ec07c" >}}Fuzzy suggestions:{{< /colored-text >}} As you type, the terminal shows a fuzzy-matched suggestions dropdown below the input. This makes it easy to discover and run commands without memorizing exact names. The suggestions update in real time as you type.

## Example Workflow

A typical session might look like this:

1. Type `ls` at the root prompt to see available sections: `about/`, `blog/`, `docs/`, `projects/`, `skills/`, `contact/`
2. Type `cd blog` or simply `blog` to navigate into the blog section
3. Type `ls` to see available categories: `tech/`, `lifestyle/`
4. Type `cd tech` to enter the tech category
5. Type `ls` to see available articles
6. Type `htmx-patterns` to read the article about HTMX patterns
7. Type `back` to return to the blog section
8. Type `reset` to go back to the homepage

{{< terminal-link url="https://gohugo.io/documentation/" >}}Official Hugo Documentation{{< /terminal-link >}} for more on how the content tree drives navigation.
