var playerView = require('./player.js');
var Long = require('big-integer');

var boardVisualization = function(game) {
  var cols = [[], [], [], [], [], [], []];

  for (var y = 5; y > -1; y--) {
    for (var x = 0; x < 7; x++) {
      game.players.forEach(function(player) {
        if (player.board.and(Long(1).shiftLeft(y + (x * 7))).value) {
          cols[x][y] = player.name;
        }
      });
      cols[x][y] = cols[x][y] || null;
    }
  }

  return cols;
};

module.exports = function(game) {
  return {
    id      : game.id,
    _board  : game.board.value,
    board   : boardVisualization(game),
    players : game.players.map(function(p) { return playerView(p, game); }),
    state   : game.state,
    winner  : game.winner
  };
};
