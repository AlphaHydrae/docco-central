
var _ = require('underscore'),
    async = require('async'),
    Class = require('clah'),
    fs = require('fs'),
    path = require('path'),
    which = require('which');

module.exports = Class.extend({

  init : function(central) {
    this.central = central;
  },

  check : function(callback) {
    async.parallel([
      this.callback(this.checkPygmentize),
      this.callback(this.checkOutputDir),
      this.callback(this.checkFiles),
      this.callback(this.checkReadme)
    ], callback);
  },

  checkOutputDir : function(callback) {
    var path = this.central.targetDir;
    if (!path || !fs.existsSync(path)) return callback();
    fs.stat(path, function(err, stats) {
      if (err) return callback(err);
      else if (!stats.isDirectory()) return callback('Error: "' + path + '" is not a directory.');
      callback();
    });
  },

  checkPygmentize : function(callback) {
    which('pygmentize', function(err) {
      if (err) {
        return callback('Error: docco requires pygmentize to be in the path.' +
          ' Install it with "easy_install pygments".');
      }
      callback();
    });
  },

  checkFiles : function(callback) {
    
    var tasks = _.map(this.central.srcFiles, function(srcFile) {
      return function(fileCallback) {
        fs.stat(srcFile, function(err, stats) {
          if (err) return fileCallback('Error: no such file or directory "' + srcFile + '".');
          else if (!stats.isFile()) return fileCallback('Error: "' + srcFile + '" is not a file.');
          fileCallback();
        });
      };
    });

    async.parallel(tasks, callback);
  },

  checkReadme : function(callback) {

    var file = path.join(this.central.rootDir, 'README.md');

    fs.stat(file, function(err, stats) {
      if (err) return callback('Error: could not find README.md in current directory.');
      else if (!stats.isFile()) return callback('Error: README.md is not a file.');
      callback();
    });
  }
});

