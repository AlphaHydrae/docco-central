
var _ = require('underscore'),
    async = require('async'),
    Class = require('clah'),
    fs = require('fs'),
    path = require('path');

var Generator = require('./generator'),
    Template = require('./template'),
    Utils = require('./utils');

module.exports = Class.extend({

  init: function(rootDir, srcFiles, options) {

    this.rootDir = rootDir;
    this.srcFiles = srcFiles;
    this.options = options;

    this.targetDir = path.join(this.rootDir, 'docs');
  },

  run : function(callback) {

    this.start = new Date().getTime();
    console.log('Processing ' + this.srcFiles.length + ' files.');

    async.series([
      this.callback(this.checkFiles),
      this.callback(this.generate)
    ], callback);
  },

  checkFiles : function(callback) {
    
    var tasks = _.map(this.srcFiles, function(srcFile) {
      return function(fileCallback) {
        fs.stat(srcFile, function(err, stats) {
          if (err) return fileCallback('Error: no such file or directory "' + srcFile + '".');
          else if (!stats.isFile()) return fileCallback('Error: "' + srcFile + '" is not a file.');
          fileCallback();
        });
      };
    });

    tasks.unshift(this.callback(this.checkReadme));

    async.parallel(tasks, callback);
  },

  checkReadme : function(callback) {

    var file = path.join(this.rootDir, 'README.md');

    fs.stat(file, function(err, stats) {
      if (err) return callback('Error: could not find README.md in current directory.');
      else if (!stats.isFile()) return callback('Error: README.md is not a file.');
      callback();
    });
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
    new Template(this.rootDir, this.srcFiles).build(callback);
  },

  generateDoc : function(srcFileRelative, callback) {
    
    var srcFile = path.resolve(this.rootDir, srcFileRelative);
    var targetDir = path.join(this.rootDir, 'docs', path.dirname(srcFileRelative));
    Utils.mkdirpSync(targetDir);

    new Generator(this.rootDir, srcFile, targetDir).run(callback);
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

