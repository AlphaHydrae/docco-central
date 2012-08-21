// ... is missing some documentation.

var fs = require('fs'),
    path = require('path');

var Utils = {

  mkdirpSync : function(dir, mode) {
    if (!fs.existsSync(dir)) {
      Utils.mkdirpSync(path.dirname(dir), mode);
      fs.mkdirSync(dir, mode);
    }
  },

  copyFile : function(source, target, callback) {

    var ifs = fs.createReadStream(source);
    var ofs = fs.createWriteStream(target);

    ifs.on('open', function() {
      ifs.pipe(ofs);
    });

    ifs.on('error', function(err) {
      callback(err);
    });

    ofs.on('error', function(err) {
      callback(err);
    });

    ofs.on('close', function() {
      callback();
    });
  }
};

module.exports = Utils;
