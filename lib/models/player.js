const Long = require('big-integer');

module.exports = function(name) {
  this.name  = name;
  this.token = name;
  this.board = Long();
};
