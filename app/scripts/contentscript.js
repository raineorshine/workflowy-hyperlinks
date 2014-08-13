(function() {
  'use strict';
  var attachEventHandlers, createLinkHtml, db, dbObject, getClosestProjectId, insertLink, isRange, promptForUrl, replaceSelection, replaceSelectionWithLink, restoreLinks, validateUrl;

  console.log('content script loaded');

  dbObject = {};

  db = {
    load: function() {
      var loadedDbObject;
      loadedDbObject = localStorage.getItem('hyperlink');
      if (loadedDbObject) {
        return dbObject = JSON.parse(loadedDbObject);
      }
    },
    save: function() {
      return localStorage.setItem('hyperlink', JSON.stringify(dbObject));
    },
    saveLink: function(projectid, content, url) {
      dbObject[projectid] = dbObject[projectid] || {};
      dbObject[projectid][content] = url;
      return db.save();
    },
    getProjectLinks: function(projectid) {
      return dbObject[projectid];
    },
    getLink: function(projectid, content) {
      return dbObject[projectid][content];
    }
  };

  isRange = function() {
    return window.getSelection().type === 'Range';
  };

  attachEventHandlers = function() {
    key('⌘+k, ctrl+k', insertLink);
    return $('.project.selected').on('input', '.content', function(e) {
      var $content;
      $content = $(e.currentTarget);
      return restoreLinks($content);
    });
  };

  promptForUrl = function() {
    var $urlInput;
    $urlInput = $('<input class="addlink-input" placeholder="URL">');
    $('body').append($urlInput);
    $urlInput.focus();
    return new Promise(function(resolve, reject) {
      $urlInput.on('keypress', function(e) {
        var val;
        val = $urlInput.val();
        if (e.which === 13) {
          $urlInput.remove();
          return resolve(val);
        }
      });
      return $urlInput.on('blur', function() {
        $urlInput.remove();
        return reject();
      });
    });
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
      var $parent, projectid;
      $parent = $(sel.focusNode.parentElement);
      projectid = $parent.closest('.project').attr('projectid');
      db.saveLink(projectid, content, url);
      return createLinkHtml(content, url);
    });
  };

  createLinkHtml = function(content, url) {
    return "<a class=\"contentLink\" href=\"" + url + "\">" + content + "</a>";
  };

  insertLink = function() {
    var sel;
    if (isRange()) {
      sel = rangy.getSelection();
      return promptForUrl().then(function(url) {
        if (url) {
          return replaceSelectionWithLink(sel, validateUrl(url));
        }
      })["catch"](function() {});
    }
  };

  validateUrl = function(url) {
    if (url.indexOf(':' > -1)) {
      url = 'http://' + url;
    }
    return url;
  };

  getClosestProjectId = function($el) {
    return $el.closest('.project').attr('projectid');
  };

  restoreLinks = function($el) {
    return setTimeout(function() {
      var content, links, offset, range, sel, url, _results;
      sel = rangy.getSelection();
      offset = sel.focusOffset;
      range = sel.getRangeAt(0);
      console.log(sel);
      links = db.getProjectLinks(getClosestProjectId($el));
      _results = [];
      for (content in links) {
        url = links[content];
        $el.html($el.html().replace(new RegExp(content, 'g'), createLinkHtml(content, url)));
        range = rangy.createRange();
        range.setStart($el[0].firstChild, offset);
        range.collapse(true);
        sel = rangy.getSelection();
        _results.push(sel.setSingleRange(range));
      }
      return _results;
    }, 50);
  };

  db.load();

  $(function() {
    return attachEventHandlers();
  });

}).call(this);
