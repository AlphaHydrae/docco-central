
var _ = require('underscore'),
    Class = require('clah'),
    fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    program = require('commander');

var Central = require('./central'),
    pkg = require(path.join(__dirname, '..', 'package.json'));

module.exports = Class.extend({

  init: function(args) {

    program
      .version(this.getVersion())
      .usage('[options] <file>...')
      .parse(process.argv);

    this.rootDir = path.resolve('.');
    this.srcFiles = _.flatten(_.map(program.args, function(file) {
      var files = glob.sync(file);
      return files.length ? files : [ file ];
    }));
  },

  run : function() {
    new Central(this.rootDir, this.srcFiles).run(function(err) {
      if (err) console.log(err);
    });
  },

  getVersion : function() {
    return pkg.version;
  }
});

