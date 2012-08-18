
var _ = require('underscore'),
    async = require('async'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    temp = require('temp');

function Generator(rootDir, srcFile, targetDir) {
  this.rootDir = rootDir;
  this.srcFile = srcFile;
  this.targetDir = targetDir;
}

_.extend(Generator.prototype, {

  run : function(callback) {
    async.waterfall([
      _.bind(this.makeTmpDir, this),
      _.bind(this.generateDoc, this),
      _.bind(this.moveToTarget, this)
    ], callback);
  },

  moveToTarget : function(callback) {

    var docDir = path.join(this.tmpDir, 'docs');
    this.docFile = path.join(docDir, path.basename(this.srcFile).replace(/\..*$/, '.html'));
    this.styleFile = path.join(docDir, 'docco.css');

    this.targetFile = path.join(this.targetDir, path.basename(this.docFile));
    this.targetStyleFile = path.join(this.targetDir, path.basename(this.styleFile));

    async.parallel([
      _.bind(this.moveDocToTarget, this),
      _.bind(this.moveStyleToTarget, this)
    ], callback);
  },

  moveDocToTarget : function(callback) {
    fs.rename(this.docFile, this.targetFile, callback);
  },

  moveStyleToTarget : function(callback) {
    if (!fs.existsSync(this.targetStyleFile)) {
      fs.rename(this.styleFile, this.targetStyleFile, callback);
    } else {
      callback();
    }
  },

  buildCommand : function() {

    var bin = path.join(this.rootDir, 'node_modules', 'docco', 'bin', 'docco');
    return bin + ' ' + this.srcFile;
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

module.exports = Generator;
