// Generated by CoffeeScript 1.7.1
var americano;

americano = require('americano');

module.exports = {
  bookmark: {
    all: function(doc) {
      return emit(Date.parse(doc.created), doc);
    }
  }
};