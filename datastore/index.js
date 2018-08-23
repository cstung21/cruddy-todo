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
  fs.readdir(exports.dataDir, function(err, data) {
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
  fs.readdir(exports.dataDir, function(err, filesList) {
    if (err) {
      callback(err);
    } else {
      _.each(filesList, (fileName) => {
      console.log('filesList', filesList, 'filesName', fileName);
        if (fileName.includes(id)) {
          fs.writeFile(exports.dataDir + '/' + id + '.txt', text, function(err, data) {
            if (err) {
              callback(err);
            } else {
              console.log('hi', { id, text: text });
              callback(null, { id, text: text });
            }
          });
        }
      });
    }
  });

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, {id: id, text: text});
  // }
};

// exports.update = (id, text, callback) => {
//   fs.readdir(exports.dataDir, function(err, filesList) {
//     if (err) {
//       callback(err);
//     } else {
//       _.each(filesList, (fileName) => {
//         // console.log('filesList', filesList, 'filesName', fileName);
//         if (!fileName.includes(id)) {
//           callback(er);
//         } else fs.writeFile(exports.dataDir + '/' + id + '.txt', text, function(err, data) {
//             if (err) {
//               callback(err);
//             } else {
//               callback(null, { id, text: text });
//             }
//           });
//       }); 
//     }
//   }
//   // var item = items[id];
//   // if (!item) {
//   //   callback(new Error(`No item with id: ${id}`));
//   // } else {
//   //   items[id] = text;
//   //   callback(null, {id: id, text: text});
//   // }
// };





exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
