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
});

/**
 * Clear dynamic terminal content (preserves home content).
 */
function clearTerminal() {
  var dynamicContent = document.getElementById('dynamic-content');
  var terminalBody = document.getElementById('terminal-body');
  if (dynamicContent) {
    dynamicContent.innerHTML = '';
  }
  if (terminalBody) {
    terminalBody.scrollTop = 0;
  }
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
