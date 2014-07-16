var _ = require('underscore');
var marked = require('marked');
var hljs = require('highlight.js');

marked.setOptions({
  sanitize: true,
  highlight: function(code, lang) {
    return hljs.highlightAuto(code).value;
  }
});

// Trello Cards markdown parser
module.exports = function(lists, html) {
  _.each(lists, function(list) {
    var cards = list.cards;
    if (cards) {
      _.each(cards, function(card) {
        if (card.desc) card.html = marked(card.desc);
      });
    }
  });
  return lists;
};
