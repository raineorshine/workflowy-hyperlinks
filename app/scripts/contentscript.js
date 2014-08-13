(function() {
  'use strict';
  var addLink, attachEventHandlers, getSelectionHtml, isRange, parseLinks, promptForUrl, replaceSelection, replaceSelectionWithLink;

  console.log('content script loaded');

  getSelectionHtml = function() {
    var container, html, i, len, sel;
    html = "";
    sel = window.getSelection();
    if (sel.rangeCount) {
      container = document.createElement("div");
      i = 0;
      len = sel.rangeCount;
      while (i < len) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
        ++i;
      }
      html = container.innerHTML;
    }
    return html;
  };

  isRange = function() {
    return window.getSelection().type === 'Range';
  };

  attachEventHandlers = function() {
    key('⌘+k, ctrl+k', function() {
      var sel;
      if (isRange()) {
        sel = rangy.getSelection();
        return promptForUrl(function(url) {
          if (url) {
            return replaceSelectionWithLink(sel, url);
          }
        });
      }
    });
    return $('.project.selected').on('input', '.content', function(e) {
      var $content;
      $content = $(e.currentTarget);
      return parseLinks($content);
    });
  };

  promptForUrl = function(cb) {
    var $urlInput;
    $urlInput = $('<input class="addlink-input" placeholder="URL">');
    $urlInput.on('keypress', function(e) {
      var val;
      val = $urlInput.val();
      if (e.which === 13) {
        $urlInput.remove();
        if (val) {
          return cb(val);
        }
      }
    });
    $urlInput.on('blur', function() {
      return $urlInput.remove();
    });
    $('body').append($urlInput);
    return $urlInput.focus();
  };

  replaceSelection = function(sel, content) {
    var contentFunction, node, range;
    contentFunction = typeof content === 'function' ? content : function() {
      return content;
    };
    range = sel.getRangeAt(0);
    node = range.createContextualFragment(contentFunction(sel.toString()));
    range.deleteContents();
    return range.insertNode(node);
  };

  replaceSelectionWithLink = function(sel, url) {
    return replaceSelection(sel, function(content) {
      return "<a class=\"contentLink\" href=\"" + url + "\">" + content + "</a>";
    });
  };

  addLink = function() {};

  parseLinks = function($el) {
    return console.log('content changed');
  };

  $(function() {
    console.log('domread');
    return attachEventHandlers();
  });

}).call(this);
