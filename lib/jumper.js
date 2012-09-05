// ... is missing some documentation.

var _ = require('underscore'),
    Class = require('clah'),
    fs = require('fs'),
    path = require('path');

module.exports = Class.extend({

  init : function(srcFiles) {

    this.srcFiles = srcFiles;

    this.resDir = path.join(__dirname, '..', 'res');
  },

  menu : function(fromSrcFile, callback) {

    var data = {
      files: this.files(fromSrcFile)
    };

    fs.readFile(path.join(this.resDir, 'menu.html'), 'utf-8', function(err, html) {
      callback(undefined, _.template(html, data));
    });
  },

  docFile : function(srcFile, fromSrcFile) {
    var depth = this.depth(fromSrcFile);
    var docFile = srcFile.replace(/\..*$/, '.html');
    var back = Array(depth).join('../');
    return path.join(back, docFile);
  },

  files : function(fromSrcFile) {
    var files = _.map(this.srcFiles, this.callback(this.fileData, fromSrcFile));
    files.unshift(this.fileData(fromSrcFile, 'index.html'));
    return files;
  },

  fileData : function(fromSrcFile, srcFile) {
    return {
      srcFile: srcFile,
      docFile: this.docFile(srcFile, fromSrcFile)
    };
  },

  depth : function(srcFile) {
    
    var d = 0;
    var dir = srcFile;
    do {
      dir = path.dirname(dir);
    } while (++d < 100 && !dir.match(/^(\.|\/)$/));

    return d;
  }
});
