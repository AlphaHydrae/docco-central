
// **Central** is the class that controls the entire generation process. It will use
// [Checker](checker.html) to validate its configuration,
// [Generator](generator.html) to create Docco documentation from the source files,
// and [Front](front.html) to create the front page.
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
    Front = require('./front'),
    Generator = require('./generator'),
    Jumper = require('./jumper'),
    Logger = require('./logger'),
    Utils = require('./utils');

module.exports = Class.extend({

  // ### Constructor
  // * **workingDir**: the directory from which the readme and other files
  //   are taken by default.
  // * **srcFiles**: the relative paths of the source files to document
  //   (these must be real paths without globs)
  // * **targetDir**: where the documentation should be output.
  // * **options**: additional configuration (see Options).
  //
  // ### Options
  // * **logger**: logger options object (see [Logger](logger.html)).
  init: function(workingDir, srcFiles, targetDir, options) {

    this.workingDir = workingDir;
    this.srcFiles = srcFiles.sort();
    this.targetDir = targetDir;

    this.options = _.isObject(options) ? options : {};

    this.checker = new Checker(this);
    this.front = new Front(this.workingDir, this.srcFiles, this.targetDir, this.options.front);
    this.jumper = new Jumper(this.srcFiles);
    this.logger = new Logger(this.options.logger);
  },

  // ### Make it so
  // Here's where we run the whole thing.
  run : function(callback) {

    this.start = new Date().getTime();

    async.series([
      // The checker makes sure that we have everything we need.
      this.checker.callback(this.checker.check),
      this.callback(this.generate)
    ], callback);
  },

  generate : function(callback) {

    this.logger.log('Processing ' + this.srcFiles.length + ' files.');

    Utils.mkdirpSync(this.targetDir);

    // Docco generation is run in parallel for all source files.
    var self = this;
    var tasks = _.map(this.srcFiles, function(srcFile) {
      return self.callback(self.generateDoc, srcFile);
    });

    // As well as the generation of the front page.
    tasks.unshift(this.callback(this.generateFrontPage));

    this.logger.toggleStdout();
    async.parallel(tasks, this.callback(this.done, function(err) {
      self.logger.toggleStdout();
      callback(err);
    }));
  },

  // ### Front Page & Doc Generation

  // The front page is delegated to [Front](front.html)
  generateFrontPage : function(callback) {
    this.front.build(callback);
  },

  // [Generator](generator.html) handles the Docco documentation for each source file.
  generateDoc : function(srcFile, callback) {
    new Generator(this.workingDir, srcFile, this.targetDir, this.jumper, this.logger, this.options.docco).run(callback);
  },

  // ### And we're done!
  done : function(callback, err) {
    if (err) {
      if (callback) callback(err);
      return;
    }

    var duration = new Date().getTime() - this.start;
    this.logger.log('Done in ' + duration + 'ms.');

    if (callback) callback();
  }
});

