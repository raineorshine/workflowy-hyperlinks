(function() {
  'use strict';
  chrome.runtime.onInstalled.addListener(function(details) {
    return console.log('previousVersion', details.previousVersion);
  });

  console.log('\'Allo \'Allo! Event Page');

}).call(this);
