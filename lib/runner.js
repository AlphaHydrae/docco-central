
var _ = require('underscore'),
    glob = require('glob'),
    path = require('path');

var Central = require('./central');

function Runner(args) {

  this.args = args ? args : process.argv.slice(2);

  this.rootDir = path.resolve('.');
  this.files = _.flatten(_.map(this.args, function(file) {
    return glob.sync(file);
  }));
}

_.extend(Runner.prototype, {

  run : function() {
    new Central(this.rootDir, this.files).run();
  }
});

module.exports = Runner;
