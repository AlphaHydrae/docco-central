
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

  init: function(rootDir, srcFiles, targetDir, options) {

    this.rootDir = rootDir;
    this.srcFiles = srcFiles;
    this.targetDir = targetDir;
    this.options = options;
  },

  run : function(callback) {

    this.start = new Date().getTime();
    console.log('Processing ' + this.srcFiles.length + ' files.');

    var checker = new Checker(this);

    async.series([
      checker.callback(checker.check),
      this.callback(this.generate)
    ], callback);
  },

  generate : function(callback) {

    Utils.mkdirpSync(this.targetDir);

    var self = this;
    var tasks = _.map(this.srcFiles, function(srcFile) {
      return self.callback(self.generateDoc, srcFile);
    });

    tasks.unshift(this.callback(this.generateTemplate));

    async.parallel(tasks, this.callback(this.done, callback));
  },

  generateTemplate : function(callback) {
    new Template(this.rootDir, this.srcFiles, this.targetDir).build(callback);
  },

  generateDoc : function(srcFileRelative, callback) {
    
    var srcFile = path.resolve(this.rootDir, srcFileRelative);
    var targetDir = path.join(this.targetDir, path.dirname(srcFileRelative));
    Utils.mkdirpSync(targetDir);

    new Generator(srcFile, targetDir).run(callback);
  },

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

