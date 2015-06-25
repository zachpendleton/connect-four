var playerView = require('./player.js');
var Long = require('big-integer');

module.exports = function(game) {
  var cols = [[], [], [], [], [], [], []];

  for (var y = 5; y > -1; y--) {
    for (var x = 0; x < 7; x++) {
      // TODO
    }
  }

  return {
    id      : game.id,
    _board  : game.board.value,
    board   : null,
    players : game.players.map(function(p) { return playerView(p, game); }),
    state   : game.state,
    winner  : game.winner
  };
};
