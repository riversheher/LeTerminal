/* ==============================================
   Command Bar UI - Dynamic command bar updates
   ============================================== */

var TerminalCommandBarUI = (function() {
  'use strict';

  var _originalPrompt = '';
  var _originalLinksHtml = '';
  var _hiddenCommands = ['cd', 'ls', 'pwd']; // keyboard-only builtins

  function init() {
    var bar = document.getElementById('command-bar');
    if (bar) {
      var promptEl = bar.querySelector('.command-bar__prompt');
      var linksEl = bar.querySelector('.command-bar__links');
      if (promptEl) _originalPrompt = promptEl.textContent;
      if (linksEl) _originalLinksHtml = linksEl.innerHTML;
    }
    document.addEventListener('filesystem:changed', _rebuild);
    _rebuild();
  }

  function _rebuild() {
    if (typeof TerminalCommands === 'undefined' || typeof TerminalFilesystem === 'undefined') return;

    var bar = document.getElementById('command-bar');
    if (!bar) return;
    var promptEl = bar.querySelector('.command-bar__prompt');
    var linksEl = bar.querySelector('.command-bar__links');
    if (!linksEl) return;

    var isRoot = TerminalFilesystem.isRoot();
    var path = TerminalFilesystem.getPath();

    // Update prompt
    if (promptEl) {
      promptEl.textContent = isRoot ? _originalPrompt : '$ ' + path + ':';
    }

    // At root with no hash: restore original static links
    if (isRoot && !window.location.hash) {
      linksEl.innerHTML = _originalLinksHtml;
      _attachClickHandlers(linksEl);
      if (typeof htmx !== 'undefined') htmx.process(linksEl);
      return;
    }

    // Build dynamic links
    var html = '';
    var allCommands = TerminalCommands.all();

    for (var i = 0; i < allCommands.length; i++) {
      var cmd = allCommands[i];

      // Skip hidden keyboard-only commands
      if (_hiddenCommands.indexOf(cmd.name) !== -1) continue;

      // Skip config commands when not at root
      if (cmd.source === 'config' && !isRoot) continue;

      var display = cmd.name;
      var type = cmd.source === 'tree' ? _getTreeType(cmd.name) : 'command';
      if (type === 'directory') display += '/';

      var cls = 'terminal-command';
      if (type === 'directory') cls += ' terminal-command--directory';
      if (cmd.source === 'builtin') cls += ' terminal-command--builtin';

      html += '<a href="#" class="' + cls + '" data-cmd-name="' + _escapeHtml(cmd.name) + '" title="' + _escapeHtml(cmd.description || '') + '">' + _escapeHtml(display) + '</a>';
    }

    linksEl.innerHTML = html;
    _attachClickHandlers(linksEl);
    if (typeof htmx !== 'undefined') htmx.process(linksEl);
  }

  function _getTreeType(name) {
    var commands = TerminalFilesystem.getCommands();
    for (var i = 0; i < commands.length; i++) {
      if (commands[i].name === name) {
        return commands[i].type;
      }
    }
    return 'command';
  }

  function _attachClickHandlers(container) {
    var links = container.querySelectorAll('a[data-cmd-name]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', _onCommandClick);
    }
  }

  function _onCommandClick(e) {
    e.preventDefault();
    var name = this.getAttribute('data-cmd-name');
    if (name) {
      TerminalCommands.execute(name);
    }
  }

  function _escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  return {
    init: init
  };
})();
