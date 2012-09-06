// ... is missing some documentation.

var _ = require('underscore'),
    async = require('async'),
    Class = require('clah'),
    fs = require('fs'),
    path = require('path'),
    showdown = require('showdown');

var utils = require('./utils');

module.exports = Class.extend({

  init : function(rootDir, sourceFiles, targetDir, options) {

    this.rootDir = rootDir;
    this.sourceFiles = sourceFiles;
    this.targetDir = targetDir;

    this.options = _.isObject(options) ? options : {};
    this.resDir = path.join(__dirname, '..', 'res');
  },

  build : function(callback) {
    async.parallel([
      this.callback(this.copyAssets),
      this.callback(this.copyPage)
    ], callback);
  },

  copyPage : function(callback) {

    async.waterfall([
      this.callback(this.loadTemplate),
      this.callback(this.fillTemplate),
      this.callback(this.saveTemplate)
    ], callback);
  },

  getTitle : function() {
    if (this.options.title) {
      return this.options.title;
    } else {
      return 'Doc Index';
    }
  },

  getWindowTitle : function() {
    if (this.options.windowTitle) {
      return this.options.windowTitle;
    } else if (this.options.title) {
      return this.options.title;
    } else {
      return 'Doc Index';
    }
  },

  getFiles : function() {
    return _.map(this.sourceFiles, function(sourceFile) {
      var docFile = sourceFile.replace(/\..*$/, '.html');
      return {
        srcFile: sourceFile,
        srcDirname: path.dirname(sourceFile),
        srcBasename: path.basename(sourceFile),
        docFile: docFile,
        docDirname: path.dirname(docFile),
        docBasename: path.basename(docFile)
      };
    });
  },

  loadTemplate : function(callback) {

    async.parallel({
      template: this.callback(this.loadFile, this.templateFile()),
      readme: this.callback(this.loadMarkdownFile, this.readmeFile()),
      indexReadme: this.callback(this.loadMarkdownFile, this.indexReadmeFile())
    }, callback);
  },

  loadFile : function(file, callback) {
    if (!file) return callback();
    fs.readFile(file, 'utf-8', callback);
  },

  loadMarkdownFile : function(file, callback) {
    if (!file) return callback();

    fs.exists(file, function(exists) {
      if (!exists) return callback();
      fs.readFile(file, 'utf-8', function(err, data) {
        if (err) return callback(err);
        return callback(undefined, new showdown.converter().makeHtml(data));
      });
    });
  },

  fillTemplate : function(results, callback) {

    var data = {
      title: this.getTitle(),
      windowTitle: this.getWindowTitle(),
      files: this.getFiles(),
      readme: results.readme,
      indexReadme: results.indexReadme
    };

    return callback(undefined, _.template(results.template, data));
  },

  saveTemplate : function(data, callback) {
    fs.writeFile(path.join(this.targetDir, 'index.html'), data, 'utf-8', callback);
  },

  copyAssets : function(callback) {
    
    var self = this;
    fs.readdir(this.resDir, function(err, files) {
      if (err) return callback(err);

      var assets = _.filter(files, function(file) {
        return file.match(/\.(css|js)$/);
      });

      async.parallel(_.map(assets, function(asset) {
        return function(callback) {
          self.copyAsset(asset, callback);
        };
      }), callback);
    });
  },

  copyAsset : function(file, callback) {
    utils.copyFile(path.join(this.resDir, file), path.join(this.targetDir, file), callback);
  },

  templateFile : function() {
    return path.join(this.resDir, 'template.html');
  },

  readmeFile : function() {
    return this.options.readme || 'README.md';
  },

  indexReadmeFile : function() {
    return this.options.indexReadme || 'INDEX.md';
  }
});

