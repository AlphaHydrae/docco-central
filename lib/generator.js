// ... is missing some documentation.

var _ = require('underscore'),
    async = require('async'),
    Class = require('clah'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    rmdir = require('rmdir'),
    temp = require('temp'),
    utils = require('./utils');

module.exports = Class.extend({

  init : function(srcFile, targetDir) {
    this.srcFile = srcFile;
    this.targetDir = targetDir;
  },

  run : function(callback) {

    var self = this;
    async.series([
      this.callback(this.makeTmpDir),
      this.callback(this.generateDoc),
      this.callback(this.moveToTarget)
    ], function(err) {
      console.log(self.targetFile);
      self.cleanup(err, callback);
    });
  },

  cleanup : function(err, callback) {
    if (!this.tmpDir) return callback();
    rmdir(this.tmpDir, function(err) {
      callback();
    });
  },

  moveToTarget : function(callback) {

    var docDir = path.join(this.tmpDir, 'docs');
    this.docFile = path.join(docDir, path.basename(this.srcFile).replace(/\..*$/, '.html'));
    this.styleFile = path.join(docDir, 'docco.css');

    this.targetFile = path.join(this.targetDir, path.basename(this.docFile));
    this.targetStyleFile = path.join(this.targetDir, path.basename(this.styleFile));

    async.parallel([
      this.callback(this.moveDocToTarget),
      this.callback(this.moveStyleToTarget)
    ], callback);
  },

  moveDocToTarget : function(callback) {
    utils.copyFile(this.docFile, this.targetFile, callback);
  },

  moveStyleToTarget : function(callback) {
    if (!fs.existsSync(this.targetStyleFile)) {
      utils.copyFile(this.styleFile, this.targetStyleFile, callback);
    } else {
      callback();
    }
  },

  buildCommand : function() {
    var docco = path.join(__dirname, '..', 'node_modules', 'docco', 'bin', 'docco');
    return docco + ' ' + this.srcFile;
  },

  generateDoc : function(callback) {
    exec(this.buildCommand(), {
      cwd: this.tmpDir,
      encoding: 'utf-8'
    }, function(err) {
      callback(err);
    });
  },

  makeTmpDir : function(callback) {
    var self = this;
    temp.mkdir('docco-central', function(err, tmpDir) {
      self.tmpDir = tmpDir;
      callback(err);
    });
  }
});

