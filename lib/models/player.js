const Long = require('big-integer');
const crypto = require('crypto');

const tokenHash = function(name) {
  var sha1 = crypto.createHash('sha1');
  sha1.update(name);
  sha1.update(new Date().getTime().toString());
  sha1.update(Math.random().toString());
  return sha1.digest('hex');
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
