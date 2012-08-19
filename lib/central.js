
var _ = require('underscore'),
    async = require('async'),
    Class = require('clah'),
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

