
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
    this.options = options;

    this.resDir = path.join(__dirname, '..', 'res');
  },

  build : function(callback) {
    async.parallel([
      this.callback(this.copyAssets),
      this.callback(this.copyPage)
    ], callback);
  },

  copyPage : function(callback) {

    var self = this;
    fs.readFile(path.join(this.resDir, 'template.html'), 'utf-8', function(err, data) {
      if (err) return callback(err);

      var template = self.fillTemplate(data);

      fs.writeFile(path.join(self.targetDir, 'index.html'), template, 'utf-8', callback);
    });
  },

  getTitle : function() {
    if (!this.options || typeof(this.options.title) == 'undefined') {
      return '<h1>Index</h1>';
    } else if (this.options.title) {
      return _.template('<h1><%- title %></h1>', { title: this.title });
    } else {
      return '';
    }
  },

  getReadme : function() {
    
    var file = path.join(this.rootDir, 'README.md');

    var self = this;
    var readme = fs.readFileSync(file, 'utf-8');

    var converter = new showdown.converter();
    return converter.makeHtml(readme);
  },

  getFiles : function() {
    return _.map(this.sourceFiles, function(sourceFile) {
      return {
        dirname: path.dirname(sourceFile),
        basename: path.basename(sourceFile),
        docname: path.basename(sourceFile).replace(/\..*$/, '.html')
      };
    });
  },

  fillTemplate : function(raw) {

    var data = {
      title: this.getTitle(),
      files: this.getFiles(),
      readme: this.getReadme()
    };

    return _.template(raw, data);
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
  }
});

