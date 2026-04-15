/* ==============================================
   Terminal JS — Autoscroll, Clear, Mode Toggle, Theme
   ============================================== */

document.addEventListener('DOMContentLoaded', function() {
  var terminalBody = document.getElementById('terminal-body');

  // After every HTMX swap, scroll to bottom
  document.body.addEventListener('htmx:afterSwap', function(event) {
    if (event.detail.target && event.detail.target.id === 'dynamic-content') {
      requestAnimationFrame(function() {
        terminalBody.scrollTo({
          top: terminalBody.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  });

  // Initialize theme toggle button text
  var theme = document.documentElement.getAttribute('data-theme') || 'dark';
  updateThemeToggle(theme);

  // Register config-driven commands from data attribute
  _registerConfigCommands();

  // Initialize keyboard mode
  if (typeof TerminalKeyboard !== 'undefined') {
    TerminalKeyboard.init();
  }
});

/**
 * Register commands defined in hugo.yaml via data attributes on the command bar.
 * Each command link has data-cmd-name and data-cmd-description attributes.
 */
function _registerConfigCommands() {
  var links = document.querySelectorAll('[data-cmd-name]');
  for (var i = 0; i < links.length; i++) {
    var name = links[i].getAttribute('data-cmd-name');
    var description = links[i].getAttribute('data-cmd-description') || '';
    var fragmentUrl = links[i].getAttribute('data-cmd-fragment') || ('/' + name + '/fragment.html');

    // Don't re-register built-in commands that already have specific actions
    if (TerminalCommands.has(name) && TerminalCommands.get(name).source === 'builtin') {
      // Update description if provided
      var existing = TerminalCommands.get(name);
      if (description && !existing.description) {
        TerminalCommands.register(name, {
          description: description,
          action: existing.action,
          source: existing.source
        });
      }
      continue;
    }

    // Register as a config command with HTMX fetch action
    (function(cmdName, cmdFragment) {
      TerminalCommands.register(cmdName, {
        description: description,
        source: 'config',
        action: function(args, context) {
          if (typeof htmx !== 'undefined') {
            htmx.ajax('GET', cmdFragment, {
              target: '#dynamic-content',
              swap: 'beforeend'
            });
          }
        }
      });
    })(name, fragmentUrl);
  }
}

/**
 * Clear dynamic terminal content (preserves home content).
 */
function clearTerminal() {
  TerminalCommands.execute('clear');
}

/**
 * Toggle between dark and light themes.
 */
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme') || 'dark';
  var next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeToggle(next);
}

/**
 * Update the theme toggle button text to reflect current state.
 */
function updateThemeToggle(theme) {
  var icon = document.getElementById('theme-toggle-icon');
  var label = document.getElementById('theme-toggle-label');
  if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
  if (label) label.textContent = theme === 'dark' ? ' Light' : ' Dark';
}
