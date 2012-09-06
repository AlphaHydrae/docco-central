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
      .version(this.version())
      .usage('[options] <file>...')
      .option('-o, --output <path>', 'change the output directory ("docs" by default)', String, 'docs')
      .option('-c, --css <file>', 'use a custom CSS file for Docco pages')
      .option('-t, --template <file>', 'use a custom .jst template for Docco pages')
      .option('-r, --readme <file>', 'change the readme file ("README.md" by default)', String)
      .option('-i, --indexReadme <file>', 'add content above the index (optional, "INDEX.md" by default)', String)
      .option('--title <string>', 'change the title and window title ("Doc Index" by default)', String)
      .option('--windowTitle <string>', 'change the window title (same as the title by default)', String)
      .option('-q, --quiet', 'silence console logs')
      .parse(process.argv);

    this.rootDir = path.resolve('.');
    this.srcFiles = _.uniq(_.flatten(_.map(this.program.args, function(file) {
      var files = glob.sync(file);
      return files.length ? files : [ file ];
    })));
  },

  run : function() {
    new Central(this.rootDir, this.srcFiles, this.program.output, this.getOptions()).run(function(err) {
      if (err) console.log(err);
    });
  },

  getOptions : function() {
    return {
      front: _.pick(this.program, 'readme', 'indexReadme', 'title', 'windowTitle'),
      docco: _.pick(this.program, 'css', 'template'),
      logger: _.pick(this.program, 'quiet')
    };
  },

  version : function() {
    return pkg.version;
  }
});

