const Long = require('big-integer');

const Player = function(name, type) {
  this.name  = name;
  this.token = name;
  this.type  = (type || 'human');
  this.board = Long();
};

Player.prototype.isHuman = function() {
  return this.type === 'human';
};

module.exports = Player;
