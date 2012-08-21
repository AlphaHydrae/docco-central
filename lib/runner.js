// ... is missing some documentation.

var _ = require('underscore'),
    Class = require('clah'),
    fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    commander = require('commander');

var Central = require('./central'),
    pkg = require(path.join(__dirname, '..', 'package.json'));

module.exports = Class.extend({

  init: function(args) {

    this.program = commander
      .version(this.getVersion())
      .usage('[options] <file>...')
      .option('-o, --output <path>', 'change the output directory ("docs" by default)', String, 'docs')
      .parse(process.argv);

    this.rootDir = path.resolve('.');
    this.srcFiles = _.flatten(_.map(this.program.args, function(file) {
      var files = glob.sync(file);
      return files.length ? files : [ file ];
    }));
  },

  run : function() {
    new Central(this.rootDir, this.srcFiles, this.program.output, this.getOptions()).run(function(err) {
      if (err) console.log(err);
    });
  },

  getOptions : function() {
    return {};
  },

  getVersion : function() {
    return pkg.version;
  }
});

