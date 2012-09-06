// ... is missing some documentation.

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
      this.callback(this.checkReadme),
      this.callback(this.checkIndexReadme)
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

    var rel = this.central.front.readmeFile();
    var file = path.join(this.central.workingDir, rel);

    fs.stat(file, function(err, stats) {
      if (err) return callback('Error: could not find ' + rel + ' from current directory.');
      else if (!stats.isFile()) return callback('Error: ' + rel + ' is not a file.');
      callback();
    });
  },

  checkIndexReadme : function(callback) {

    var rel = this.central.front.indexReadmeFile();
    if (!rel) return callback();
    var file = path.join(this.central.workingDir, rel);

    fs.exists(file, function(exists) {
      if (!exists) return callback();
      fs.stat(file, function(err, stats) {
        if (err) return callback('Error: could not find ' + rel + ' from current directory.');
        else if (!stats.isFile()) return callback('Error: ' + rel + ' is not a file.');
        callback();
      });
    });
  }
});

