(function() {
  'use strict';
  var addLink, attachEventHandlers, getSelectionHtml, isRange, parseLinks, replaceSelection, replaceSelectionWithLink;

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
      if (isRange()) {
        return replaceSelectionWithLink('http://google.com');
      }
    });
    return $('.project.selected').on('input', '.content', function(e) {
      var $content;
      $content = $(e.currentTarget);
      return parseLinks($content);
    });
  };

  replaceSelection = function(content) {
    var contentFunction, node, range, sel;
    contentFunction = typeof content === 'function' ? content : function() {
      return content;
    };
    sel = rangy.getSelection();
    range = sel.getRangeAt(0);
    node = range.createContextualFragment(contentFunction(sel.toString()));
    range.deleteContents();
    return range.insertNode(node);
  };

  replaceSelectionWithLink = function(url) {
    return replaceSelection(function(content) {
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
