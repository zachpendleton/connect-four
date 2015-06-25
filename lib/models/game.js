const Long = require('big-integer');
const boardUtil = require('./../boardUtil.js');

var idCounter = 0;

const Game = function() {
  this.id = idCounter++;
  this.board = Long();
  this.players = [];
  this.winner = null;
  this.state = Game.CREATED;
  this.currentPlayer = null;
}

Game.CREATED = 'created';
Game.ACTIVE = 'active';
Game.FINISHED = 'finished';

Game.prototype.play = function(x) {
  var y = boardUtil.y(this.board, x);
  player.board = boardUtil.insert(player.board, x, y);
  this.board   = boardUtil.insert(this.board, x, y);
};

module.exports = Game;
