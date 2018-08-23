const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, id) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, function(err, data) {
        if (err) {
          callback(err);
        } else {
          items[id] = text;
          callback(null, {id: id, text: text});
        }
      });
    }  
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8', function(err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: data});
    }
  });
};

exports.readAll = (callback) => {
  var results = [];
  fs.readdir(exports.dataDir, function (err, data) {
    if (err) {
      callback(err);
    } else {
      _.each(data, (value, key) => {
        results.push({ id: value.slice(0, 5), text: value.slice(0, 5) });
      });
      callback(null, results);
    }
  });
};

exports.update = (id, text, callback) => {
  fs.open(path.join(exports.dataDir, `${id}.txt`), 'r+', function (err, filesList) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, function (err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text: text });
        }
      });
    } 
  });
};


exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), function(err) {
    if (err) {
      callback(new Error(`No item with id: ${id} `));
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
