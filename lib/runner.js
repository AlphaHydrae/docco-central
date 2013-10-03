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
      .option('-c, --config <path>', 'take options from the specified config file ("./.docco-central.json" by default)', String, '.docco-central.json')
      .option('-o, --output <path>', 'change the output directory ("docs" by default)', String)
      .option('-s, --css <file>', 'use a custom CSS file for Docco pages')
      .option('-t, --template <file>', 'use a custom .jst template for Docco pages')
      .option('-r, --readme <file>', 'change the readme file ("README.md" by default)', String)
      .option('-i, --indexReadme <file>', 'add content above the index (optional, "INDEX.md" by default)', String)
      .option('--title <string>', 'change the title and window title ("Doc Index" by default)', String)
      .option('--windowTitle <string>', 'change the window title (same as the title by default)', String)
      .option('-q, --quiet', 'silence console logs')
      .parse(process.argv);
  },

  defaultOptions : {
    output : 'docs'
  },

  run : function() {

    var workingDir = path.resolve('.');
    var srcFiles = this.program.args;
    var options = _.pick(this.program, 'config', 'output', 'css', 'template', 'readme', 'indexReadme', 'title', 'windowTitle', 'quiet');

    if (this.program.config) {
      var file = path.resolve(workingDir, this.program.config);
      var exists = fs.existsSync(file);
      if (exists) {
        var config = require(file);
        options = _.extend(config, options);
        if (config.files && !srcFiles.length) {
          srcFiles = config.files;
        }
      }
    }

    options = _.extend(_.clone(this.defaultOptions), options);

    var targetDir = options.output;

    srcFiles = _.uniq(_.flatten(_.map(srcFiles, function(file) {
      var files = glob.sync(file);
      return files.length ? files : [ file ];
    })));

    new Central(workingDir, srcFiles, targetDir, this.buildOptions(options)).run(function(err) {
      if (err) console.log(err);
    });
  },

  buildOptions : function(options) {
    return {
      front: _.pick(options, 'readme', 'indexReadme', 'title', 'windowTitle'),
      docco: _.pick(options, 'css', 'template'),
      logger: _.pick(options, 'quiet')
    };
  },

  version : function() {
    return pkg.version;
  }
});

