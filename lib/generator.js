// ... is missing some documentation.

var async = require('async'),
    Class = require('clah'),
    docco = require('docco'),
    fs = require('fs'),
    path = require('path'),
    utils = require('./utils');

module.exports = Class.extend({

  init : function(workingDir, srcFile, targetDir, jumper, logger) {

    this.workingDir = workingDir;
    this.srcFile = srcFile;
    this.targetDir = targetDir;

    this.jumper = jumper;
    this.logger = logger;

    this.docDir = path.join(this.targetDir, path.dirname(this.srcFile));
  },

  run : function(callback) {

    // Each documentation file is moved to the same relative path as its
    // source file. That way it reflects the original project structure.
    utils.mkdirpSync(this.docDir);

    async.waterfall([
      this.callback(this.buildMenu),
      this.callback(this.document),
      this.callback(this.insertMenu),
      this.callback(this.log)
    ], callback);
  },

  buildMenu : function(callback) {
    this.jumper.menu(this.srcFile, callback);
  },

  document : function(menu, callback) {
    docco.document([ this.srcFile ], { output: this.docDir }, function() {
      callback(undefined, menu);
    });
  },

  insertMenu : function(menu, callback) {

    var targetFile = this.targetFile();
    fs.readFile(targetFile, 'utf-8', function(err, contents) {
      if (err) return callback(err);
      contents = contents.replace(/<table/, menu + '<table');
      fs.writeFile(targetFile, contents, 'utf-8', callback);
    });
  },

  log : function(callback) {
    this.logger.log('- ' + this.targetFile());
    callback();
  },

  targetFile : function() {
    return path.join(this.docDir, path.basename(this.srcFile).replace(/\..*$/, '.html'));
  }
});

