/* ==============================================
   Filesystem State Engine - Site Tree Navigation
   ==============================================
   Manages virtual filesystem state from the
   embedded #site-tree JSON. Provides cd, ls,
   pwd, back, reset commands.
   ============================================== */

var TerminalFilesystem = (function() {
  'use strict';

  /* -------------------------------------------
     Internal State
     ------------------------------------------- */
  var _currentPath = '';          // e.g. '' for root, '/blog', '/docs/shortcodes'
  var _pathStack = [];            // history for back()
  var _tree = {};                 // parsed site tree from #site-tree JSON
  var _suppressHashChange = false; // prevents hashchange loop


  /* -------------------------------------------
     Initialization
     ------------------------------------------- */

  /**
   * Initialise the filesystem engine.
   * Parses the site tree, sets up hashchange listener,
   * reads the initial location, and registers FS commands.
   */
  function init() {
    _parseTree();
    window.addEventListener('hashchange', _onHashChange);
    _readInitialLocation();
    _registerCommands();
  }

  /**
   * Parse the site tree from the embedded #site-tree script tag.
   */
  function _parseTree() {
    var treeEl = document.getElementById('site-tree');
    if (!treeEl) {
      _tree = {};
      return;
    }
    try {
      var data = JSON.parse(treeEl.textContent);
      _tree = data.tree || {};
    } catch (e) {
      console.error('TerminalFilesystem: Failed to parse site tree:', e);
      _tree = {};
    }
  }

  /**
   * Read the initial location from hash or pathname.
   */
  function _readInitialLocation() {
    var hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (hash && hash !== '/') {
      _currentPath = _normalizePath(hash);
      _updateUI();
      return;
    }
    var pathname = window.location.pathname;
    if (pathname && pathname !== '/' && pathname !== '') {
      _currentPath = _normalizePath(pathname.replace(/\/$/, ''));
    }
  }

  /**
   * Register built-in filesystem commands with the command registry.
   */
  function _registerCommands() {
    if (typeof TerminalCommands === 'undefined') return;

    TerminalCommands.register('cd', {
      description: 'Change directory. Usage: cd &lt;directory&gt;',
      source: 'builtin',
      action: function(args, context) {
        var dir = args.trim();
        var result = cd(dir);
        var html = '<div class="command-output">';
        html += '<div class="prompt-line"><span class="prompt">$</span> <span class="command-echo">cd ' + _escapeHtml(dir || '') + '</span></div>';
        if (!result.success) {
          html += '<div class="output-body"><p><span class="text-error">' + _escapeHtml(result.error) + '</span></p></div>';
        }
        html += '</div>';
        context.dynamicContent.insertAdjacentHTML('beforeend', html);
        _scrollToNewContent(context.dynamicContent);
      }
    });

    TerminalCommands.register('ls', {
      description: 'List directory contents',
      source: 'builtin',
      action: function(args, context) {
        var html = formatLsOutput();
        if (context.dynamicContent) {
          context.dynamicContent.insertAdjacentHTML('beforeend', html);
        }
        _scrollToNewContent(context.dynamicContent);
      }
    });

    TerminalCommands.register('pwd', {
      description: 'Print working directory',
      source: 'builtin',
      action: function(args, context) {
        var path = pwd();
        var html = '<div class="command-output">';
        html += '<div class="prompt-line"><span class="prompt">$</span> <span class="command-echo">pwd</span></div>';
        html += '<div class="output-body"><p>' + _escapeHtml(path) + '</p></div>';
        html += '</div>';
        if (context.dynamicContent) {
          context.dynamicContent.insertAdjacentHTML('beforeend', html);
        }
        _scrollToNewContent(context.dynamicContent);
      }
    });

    TerminalCommands.register('back', {
      description: 'Go up one directory',
      source: 'builtin',
      action: function(args, context) {
        var result = back();
        var html = '<div class="command-output">';
        html += '<div class="prompt-line"><span class="prompt">$</span> <span class="command-echo">back</span></div>';
        if (!result.success) {
          html += '<div class="output-body"><p><span class="text-error">' + _escapeHtml(result.error) + '</span></p></div>';
        } else {
          html += '<div class="output-body"><p>Returned to ' + _escapeHtml(result.path) + '</p></div>';
        }
        html += '</div>';
        if (context.dynamicContent) {
          context.dynamicContent.insertAdjacentHTML('beforeend', html);
        }
        _scrollToNewContent(context.dynamicContent);
      }
    });

    TerminalCommands.register('reset', {
      description: 'Return to homepage',
      source: 'builtin',
      action: function(args, context) {
        reset();
        var html = '<div class="command-output">';
        html += '<div class="prompt-line"><span class="prompt">$</span> <span class="command-echo">reset</span></div>';
        html += '</div>';
        if (context.dynamicContent) {
          context.dynamicContent.insertAdjacentHTML('beforeend', html);
        }
        _scrollToNewContent(context.dynamicContent);
      }
    });
  }


  /* -------------------------------------------
     Public API — Navigation
     ------------------------------------------- */

  /**
   * Change to a directory.
   * @param {string} dirName - Directory name or path.
   * @returns {{success: boolean, path?: string, error?: string}}
   */
  function cd(dirName) {
    if (!dirName || dirName === '/' || dirName === '~') {
      return reset();
    }
    if (dirName === '..') {
      return back();
    }
    var target = dirName.replace(/\/$/, '');
    var children = _getChildren(_currentPath);
    var child = children[target.toLowerCase()];
    if (!child) {
      return { success: false, error: 'cd: ' + dirName + ': No such file or directory' };
    }
    if (child.type !== 'directory') {
      return { success: false, error: 'cd: ' + dirName + ': Not a directory' };
    }
    _pathStack.push(_currentPath);
    _currentPath = child.path.replace(/\/$/, '');
    _setHash(_currentPath);
    _loadSectionContent(child.path);
    _updateUI();
    return { success: true, path: _currentPath };
  }

  /**
   * List contents of the current directory.
   * @returns {Array<{name: string, type: string, title: string, description: string}>}
   */
  function ls() {
    var children = _getChildren(_currentPath);
    var entries = [];
    for (var name in children) {
      if (children.hasOwnProperty(name)) {
        entries.push({
          name: name,
          type: children[name].type,
          title: children[name].title,
          description: children[name].description,
          path: children[name].path || ''
        });
      }
    }
    entries.sort(function(a, b) {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
    return entries;
  }

  /**
   * Print working directory.
   * @returns {string}
   */
  function pwd() {
    return _currentPath || '/';
  }

  /**
   * Go back to the previous directory.
   * @returns {{success: boolean, path?: string, error?: string}}
   */
  function back() {
    if (_pathStack.length === 0) {
      return { success: false, error: 'Already at root.' };
    }
    _currentPath = _pathStack.pop();
    _setHash(_currentPath);
    if (_currentPath) {
      _loadSectionContent(_currentPath + '/');
    } else {
      var dc = document.getElementById('dynamic-content');
      if (dc) dc.innerHTML = '';
    }
    _updateUI();
    return { success: true, path: _currentPath || '/' };
  }

  /**
   * Reset to root (homepage).
   * @returns {{success: boolean, path: string}}
   */
  function reset() {
    _pathStack = [];
    _currentPath = '';
    _setHash('');
    var dc = document.getElementById('dynamic-content');
    if (dc) dc.innerHTML = '';
    var tb = document.getElementById('terminal-body');
    if (tb) tb.scrollTop = 0;
    _updateUI();
    return { success: true, path: '/' };
  }

  /**
   * Check whether the current path is the root.
   * @returns {boolean}
   */
  function isRoot() {
    return !_currentPath || _currentPath === '/';
  }

  /**
   * Get the current path string.
   * @returns {string}
   */
  function getPath() {
    return _currentPath || '/';
  }

  /**
   * Get available FS commands for the current location.
   * @returns {Array<{name: string, type: string, title: string, description: string, path?: string}>}
   */
  function getCommands() {
    var entries = ls();
    var commands = [];
    for (var i = 0; i < entries.length; i++) {
      commands.push({
        name: entries[i].name,
        type: entries[i].type,
        title: entries[i].title,
        description: entries[i].description,
        path: entries[i].path
      });
    }
    commands.push({ name: 'reset', type: 'builtin', title: 'reset', description: 'Return to homepage' });
    if (!isRoot()) {
      commands.push({ name: 'back', type: 'builtin', title: 'back', description: 'Go up one directory' });
    }
    return commands;
  }

  /**
   * Format the ls output as HTML.
   * @returns {string}
   */
  function formatLsOutput() {
    var entries = ls();
    var html = '<div class="command-output">';
    html += '<div class="prompt-line"><span class="prompt">$</span> <span class="command-echo">ls</span></div>';
    html += '<div class="output-body"><table class="ls-output">';
    for (var i = 0; i < entries.length; i++) {
      var typeLabel = entries[i].type === 'directory' ? 'dir' : 'file';
      var nameDisplay = entries[i].type === 'directory'
        ? '<strong>' + _escapeHtml(entries[i].name) + '/</strong>'
        : _escapeHtml(entries[i].name);
      html += '<tr><td class="ls-output__type">' + typeLabel + '</td><td class="ls-output__name">' + nameDisplay + '</td></tr>';
    }
    if (entries.length === 0) {
      html += '<tr><td class="ls-output__name text-dim" colspan="2">This directory is empty.</td></tr>';
    }
    html += '</table></div></div>';
    return html;
  }


  /* -------------------------------------------
     Private Helpers
     ------------------------------------------- */

  /**
   * Normalise a path: strip leading/trailing slashes, ensure leading slash.
   * @param {string} path
   * @returns {string}
   */
  function _normalizePath(path) {
    path = path.replace(/^\//, '').replace(/\/$/, '');
    return path ? '/' + path : '';
  }

  /**
   * Get the children object for a given path.
   * Walks the tree segments to find the right node.
   * @param {string} path
   * @returns {object}
   */
  function _getChildren(path) {
    var node = _tree;
    if (path) {
      var segments = path.replace(/^\//, '').split('/');
      for (var i = 0; i < segments.length; i++) {
        var seg = segments[i].toLowerCase();
        if (node[seg] && node[seg].type === 'directory' && node[seg].children) {
          node = node[seg].children;
        } else {
          return {};
        }
      }
    }
    return node || {};
  }

  /**
   * Set the URL hash (suppressing the hashchange event).
   * @param {string} path
   */
  function _setHash(path) {
    _suppressHashChange = true;
    var hash = path ? '#' + path : '';
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setTimeout(function() { _suppressHashChange = false; }, 50);
  }

  /**
   * Handle hashchange events from browser navigation.
   */
  function _onHashChange() {
    if (_suppressHashChange) return;
    var hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    var newPath = _normalizePath(hash);
    if (newPath !== _currentPath) {
      _currentPath = newPath;
      _updateUI();
    }
  }

  /**
   * Dispatch a custom event so other modules can react to FS changes.
   */
  function _updateUI() {
    var event = new CustomEvent('filesystem:changed', {
      detail: { path: _currentPath, commands: getCommands() }
    });
    document.dispatchEvent(event);
  }

  /**
   * Scroll the terminal body so newly appended content in a container
   * appears at the top of the viewport.
   * @param {Element|null} container - The dynamic content container.
   */
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

  /**
   * Escape HTML special characters.
   * @param {string} text
   * @returns {string}
   */
  function _escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Load section content via HTMX after filesystem navigation.
   * @param {string} path - The section path (e.g. '/blog/').
   */
  function _loadSectionContent(path) {
    if (typeof htmx !== 'undefined') {
      htmx.ajax('GET', path + 'fragment.html', {
        target: '#dynamic-content',
        swap: 'beforeend'
      });
    }
  }


  /* -------------------------------------------
     Public API
     ------------------------------------------- */
  return {
    init: init,
    cd: cd,
    ls: ls,
    pwd: pwd,
    back: back,
    reset: reset,
    isRoot: isRoot,
    getPath: getPath,
    getCommands: getCommands,
    formatLsOutput: formatLsOutput
  };
})();
