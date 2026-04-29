/* ==============================================
   Command Generator - Auto-register tree commands
   ============================================== */

var TerminalCommandGenerator = (function() {
  'use strict';

  function init() {
    // Rebuild commands on filesystem changes
    document.addEventListener('filesystem:changed', _rebuildCommands);
    // Initial build
    _rebuildCommands();
  }

  function _rebuildCommands() {
    if (typeof TerminalCommands === 'undefined' || typeof TerminalFilesystem === 'undefined') return;

    // Remove old tree commands
    TerminalCommands.clearSource('tree');

    // Get available commands for current directory
    var commands = TerminalFilesystem.getCommands();
    if (!commands || !commands.length) return;

    for (var i = 0; i < commands.length; i++) {
      var cmd = commands[i];
      var name = cmd.name;
      if (!name) continue;

      // Skip if a config command already exists (config overrides tree)
      var existing = TerminalCommands.get(name);
      if (existing && existing.source === 'config') continue;

      // Skip builtins (reset, back, etc.)
      if (cmd.type === 'builtin') continue;

      var description = cmd.description || cmd.title || name;
      var type = cmd.type;
      var path = cmd.path || '';

      TerminalCommands.register(name, {
        description: description,
        source: 'tree',
        action: _makeAction(type, name, path)
      });
    }
  }

  function _makeAction(type, name, path) {
    if (type === 'directory') {
      return function(args, context) {
        var result = TerminalFilesystem.cd(name);
        if (!result.success) {
          var html = '<div class="command-output">';
          html += '<div class="prompt-line"><span class="prompt">$</span> <span class="command-echo">' + _escapeHtml(name) + '</span></div>';
          html += '<div class="output-body"><p><span class="text-error">' + _escapeHtml(result.error) + '</span></p></div>';
          html += '</div>';
          if (context.dynamicContent) {
            context.dynamicContent.insertAdjacentHTML('beforeend', html);
          }
          _scrollToNewContent(context.dynamicContent);
        }
      };
    }

    // Page type
    return function(args, context) {
      var fragmentUrl = (path || '/' + name + '/') + 'fragment.html';
      if (typeof htmx !== 'undefined') {
        htmx.ajax('GET', fragmentUrl, {
          target: '#dynamic-content',
          swap: 'beforeend'
        });
      } else {
        // Fallback: show error
        var html = '<div class="command-output">';
        html += '<div class="prompt-line"><span class="prompt">$</span> <span class="command-echo">' + _escapeHtml(name) + '</span></div>';
        html += '<div class="output-body"><p><span class="text-error">HTMX not available</span></p></div>';
        html += '</div>';
        if (context.dynamicContent) {
          context.dynamicContent.insertAdjacentHTML('beforeend', html);
        }
      }
    };
  }

  function _escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function _scrollToNewContent(container) {
    if (!container) return;
    var terminalBody = document.getElementById('terminal-body');
    if (!terminalBody) return;
    var target = container.lastElementChild;
    if (target) {
      requestAnimationFrame(function() {
        terminalBody.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      });
    }
  }

  return {
    init: init
  };
})();
