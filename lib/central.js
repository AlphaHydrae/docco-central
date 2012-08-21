
// **Central** controls the entire generation process. It will use
// [Checker](checker.html) to validate its configuration,
// [Generator](generator.html) to create Docco documentation from the source files,
// and [Template](template.html) to create the front page.
//
// You're in the right place if you want to use docco-central programmatically:
//
//     var sources = [ 'lib/underscore.js' ];
//     var central = new Central('.', sources, 'docs');
//
//     central.run(function(err) {
//       if (err) return console.log(err);
//       console.log('All done!');
//     });

var _ = require('underscore'),
    async = require('async'),
    Class = require('clah'),
    fs = require('fs'),
    path = require('path'),
    which = require('which');

var Checker = require('./checker'),
    Generator = require('./generator'),
    Template = require('./template'),
    Utils = require('./utils');

module.exports = Class.extend({

  // ### Constructor
  // * **workingDir**: the directory from which the readme and other files
  //   are taken by default.
  // * **srcFiles**: the relative paths of the source files to document
  //   (these must be real paths without globs)
  // * **targetDir**: where the documentation should be output.
  init: function(workingDir, srcFiles, targetDir) {

    this.workingDir = workingDir;
    this.srcFiles = srcFiles;
    this.targetDir = targetDir;
  },

  // ### Make it so
  // Here's where we run the whole thing.
  run : function(callback) {

    this.start = new Date().getTime();
    console.log('Processing ' + this.srcFiles.length + ' files.');

    // The checker makes sure that we have everything we need.
    var checker = new Checker(this);

    async.series([
      checker.callback(checker.check),
      this.callback(this.generate)
    ], callback);
  },

  generate : function(callback) {

    Utils.mkdirpSync(this.targetDir);

    // Docco generation is run in parallel for all source files.
    var self = this;
    var tasks = _.map(this.srcFiles, function(srcFile) {
      return self.callback(self.generateDoc, srcFile);
    });

    // As well as the generation of the front page.
    tasks.unshift(this.callback(this.generateFrontPage));

    async.parallel(tasks, this.callback(this.done, callback));
  },

  // ### Front Page & Doc Generation

  // The front page is delegated to [Template](template.html)
  generateFrontPage : function(callback) {
    new Template(this.workingDir, this.srcFiles, this.targetDir).build(callback);
  },

  // [Generator](generator.html) handles the Docco documentation for each source file.
  generateDoc : function(srcFileRelative, callback) {
    
    var srcFile = path.resolve(this.workingDir, srcFileRelative);

    // Each documentation file is moved to the same relative path as its
    // source file. That way it reflects the original project structure.
    var targetDir = path.join(this.targetDir, path.dirname(srcFileRelative));
    Utils.mkdirpSync(targetDir);

    new Generator(srcFile, targetDir).run(callback);
  },

  // ### And we're done!
  done : function(callback, err) {
    if (err) {
      if (callback) callback(err);
      return;
    }

    var duration = new Date().getTime() - this.start;
    console.log('Done in ' + duration + 'ms.');

    if (callback) callback();
  }
});

