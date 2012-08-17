
var fs = require('fs'),
    showdown = require('showdown'),
    glob = require('glob'),
    _ = require('underscore'),
    path = require('path'),
    exec = require('child_process').exec,
    async = require('async'),
    rmdir = require('rmdir');

var files = _.flatten(_.map(process.argv.slice(2), function(file) {
  return glob.sync(file);
}));

console.log(files);

// Process readme.
var converter = new showdown.converter();
var rawReadme = fs.readFileSync('README.md', 'utf-8');
var htmlReadme = converter.makeHtml(rawReadme);

// Process title.
var title = '<h1>Index</h1>';

// Process index.
var index = '<ul>';
_.each(files, function(file) {
  var dirname = path.dirname(file);
  var basename = path.basename(file);
  index += '<li>';
  if (dirname) {
    index += '<span class="dirs">' + dirname + '/</span>';
  }
  index += '<a href="' + file.replace(/\..*$/, '.html') + '">' + basename + '</a></li>';
});
index += '</ul>';
index += '</div>';

// Write files.
var template = fs.readFileSync('res/template.html', 'utf-8');
var stylesheet = fs.readFileSync('res/central.css', 'utf-8');
var clientJs = fs.readFileSync('res/central.js', 'utf-8');
var jquery = fs.readFileSync('res/jquery-1.8.0-min.js', 'utf-8');

template = template.replace(/@@title/, title);
template = template.replace(/@@index/, index);
template = template.replace(/@@readme/, htmlReadme);

if (!fs.existsSync('docs')) {
  fs.mkdirSync('docs');
}
fs.writeFileSync('docs/index.html', template, 'utf-8');
fs.writeFileSync('docs/central.css', stylesheet, 'utf-8');
fs.writeFileSync('docs/central.js', clientJs, 'utf-8');
fs.writeFileSync('docs/jquery-1.8.0-min.js', jquery, 'utf-8');

function mkdirp(dir) {
  if (!fs.existsSync(path.dirname(dir))) {
    mkdirp(path.dirname(dir));
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

var root = path.resolve('.');

var tmp = path.join(root, 'docs', '.tmp');
mkdirp(tmp);

var css = null;

async.parallel(_.map(files, function(file) {
  return function(callback) {

    var command = path.join(root, 'node_modules', 'docco', 'bin', 'docco');
    command += ' ' + path.resolve(root, file);

    console.log('executing: ' + command);
    var child = exec(command, {
      cwd: tmp,
      encoding: 'utf-8'
    }, function(err, stdout, stderr) {
      if (err) {
        return callback(err);
      }

      var generatedDir = path.join(tmp, 'docs');
      var generated = path.join(generatedDir, path.basename(file).replace(/\..*$/, '.html'));

      var targetDir = path.join(root, 'docs', path.dirname(file));
      var target = path.join(targetDir, path.basename(generated));

      mkdirp(targetDir);
      fs.renameSync(generated, target);

      if (!css) {
        css = fs.readFileSync(path.join(generatedDir, 'docco.css'), 'utf-8');
      }

      var targetStylesheet = path.join(targetDir, 'docco.css');
      if (!fs.existsSync(targetStylesheet)) {
        fs.writeFileSync(targetStylesheet, css, 'utf-8');
      }
      callback();
    });
  };
}), function(err) {
  if (err) {
    return console.log('ERROR: ' + err);
  }
  rmdir(tmp, function(err) {
    if (err) {
      console.log('WARNING: ' + err);
    }
  });
});

