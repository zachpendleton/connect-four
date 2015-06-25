module.exports = function(player, game) {
  var playerView = {
    name   : player.name,
    _board : player.board
  };

  if (player === game.currentPlayer) {
    playerView.token = player.token;
  }

  return playerView;
};
