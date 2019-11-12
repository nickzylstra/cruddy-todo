const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counterString) => {
    const fileName = path.join(exports.dataDir, `${counterString}.txt`);
    fs.writeFile(fileName, text, (err) => {
      if (err) {
        return new Error('Failed to create Todo file.');
      }
      callback(null, {
        id: counterString,
        text: text
      });
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return new Error('Cannot readAll');
    }
    const updatedFiles = _.map(files, (file) => {
      const name = path.basename(file, '.txt');
      return {
        id: name,
        text: name,
      };
    });
    callback(null, updatedFiles);
    return updatedFiles;
  });
};

exports.readOne = (id, callback) => {
  const fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(fileName, 'utf8', (err, todoText) => {
    if (err) {
      callback(err);
      return new Error('Could not readOne');
    }
    const todo = {
      id,
      text: todoText,
    };
    callback(null, todo);
    return todo;
  });
};

exports.update = (id, text, callback) => {
  const fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.open(fileName, 'r', (err, fd) => {
    if (err) {
      callback(err);
      return new Error('Todo does not exist');
    }


    fs.writeFile(fileName, text, (err) => {
      if (err) {
        callback(err);
        return new Error('Failed to update Todo file.');
      }
      callback(null, {
        id,
        text: text
      });
    });
  });
};

exports.delete = (id, callback) => {
  const fileName = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(fileName, (err) => {
    if (err) {
      callback(err);
      return new Error('Failed to delete todo');
    }
    callback(null);
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
