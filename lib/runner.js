
var _ = require('underscore'),
    Class = require('clah'),
    glob = require('glob'),
    path = require('path');

var Central = require('./central');

module.exports = Class.extend({

  init: function(args) {

    this.args = args ? args : process.argv.slice(2);

    this.rootDir = path.resolve('.');
    this.files = _.flatten(_.map(this.args, function(file) {
      return glob.sync(file);
    }));
  },

  run : function() {
    new Central(this.rootDir, this.files).run();
  }
});

