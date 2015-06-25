const Long = require('big-integer');
const boardUtil = require('./../boardUtil.js');
const gameView = require('./../views/game.js');

var idCounter = 0;

const TIMEOUT = 60000;

const Game = function() {
  this.id = idCounter++;
  this.board = Long();
  this.players = [];
  this.responses = [];
  this.winner = null;
  this.state = Game.CREATED;
  this.currentPlayer = null;
  this.timeout = null;
  this.created = new Date().getTime();
}

Game.CREATED = 'created';
Game.ACTIVE = 'active';
Game.FINISHED = 'finished';
Game.DRAW = 'draw';

Game.prototype.isFull = function() {
  return this.players.length >= 2;
};

Game.prototype.isActive = function() {
  return this.state === Game.ACTIVE;
}

Game.prototype.makePlay = function(x) {
  var y = boardUtil.y(this.board, x);
  if (typeof y !== 'undefined') {
    this.currentPlayer.board = boardUtil.insert(this.currentPlayer.board, x, y);
    this.board = boardUtil.insert(this.board, x, y);
    return true;
  } else {
    return false;
  }
};

Game.prototype.start = function() {
  this.state = Game.ACTIVE;
  this.currentPlayer = this.players[0];
};

Game.prototype.finish = function(winner) {
  if (winner) {
    this.state = Game.FINISHED;
    this.winner = winner.name;
  } else {
    this.state = Game.DRAW;
  }

  var response;

  clearTimeout(this.timeout);
  while (response = this.responses.shift()) {
    response.send(gameView(this));
  }
};

Game.prototype.otherPlayer = function() {
  return this.players.filter(function(player) {
    return player.token !== this.currentPlayer.token;
  }.bind(this))[0];
};

Game.prototype.startClock = function() {
  clearTimeout(this.timeout);
  this.timeout = setTimeout(function() {
    this.finish(this.otherPlayer());
  }.bind(this), TIMEOUT);
};

module.exports = Game;
