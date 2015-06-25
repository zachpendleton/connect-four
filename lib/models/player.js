const Long = require('big-integer');
const crypto = require('crypto');

const tokenHash = function(name) {
  var sha1 = crypto.createHash('sha1');
  hash.update(name);
  hash.update(new Date().getTime().toString());
  hash.update(Math.random().toString());
  return hash.digest('hex');
};

const Player = function(name, type) {
  this.name  = name;
  this.token = tokenHash(name);
  this.type  = (type || 'human');
  this.board = Long();
};

Player.prototype.isHuman = function() {
  return this.type === 'human';
};

module.exports = Player;
