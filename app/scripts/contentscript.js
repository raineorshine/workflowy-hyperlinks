(function() {
  'use strict';
  var addLink, attachEventHandlers, getSelectionHtml, parseLinks;

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

  attachEventHandlers = function() {
    key('⌘+k, ctrl+k', function() {
      var selectedText;
      selectedText = getSelectionHtml();
      if (selectedText > 0) {
        return replaceSelect('test');
      }
    });
    return $('.project.selected').on('input', '.content', function(e) {
      var $content;
      $content = $(e.currentTarget);
      return parseLinks($content);
    });
  };

  replaceSelection(function(content) {
    var node, range, sel;
    sel = rangy.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    node = range.createContextualFragment("<span><font color=\"red\">hoho</font></span>");
    return range.insertNode(node);
  });

  addLink = function() {};

  parseLinks = function($el) {
    return console.log('content changed');
  };

  $(function() {
    return attachEventHandlers();
  });

}).call(this);
