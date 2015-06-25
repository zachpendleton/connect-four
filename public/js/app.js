'use strict';

var Dashboard = React.createClass({
  displayName: 'Dashboard',

  render: function render() {
    var games = this.props.games.map(function (game) {
      var key = 'game-' + game.id;
      return React.createElement(Board, { game: game, key: key });
    });
    return React.createElement(
      'div',
      { className: 'gameDashboard' },
      games
    );
  }
});

var Board = React.createClass({
  displayName: 'Board',

  players: function players() {
    var out = {};
    var keys = ['x', 'o'];
    this.props.game.players.forEach(function (p) {
      out[p.name] = keys.shift();
    });
    return out;
  },

  render: function render() {
    var players = this.players();
    var board = this.props.game.board;

    var columns = board.map((function (col, i) {
      var key = ['game', this.props.game.id, 'col', i];
      var tokens = col.reverse().map((function (token, j) {
        var classes = ['token'];
        var key = ['game', this.props.game.id, 'col', i, 'token', j];

        for (var player in players) {
          if (token === player) classes.push(players[player]);
        }

        return React.createElement('div', { className: classes.join(' '), key: key.join('-') });
      }).bind(this));

      return React.createElement(
        'div',
        { className: 'gameBoard__column', key: key.join('-') },
        tokens
      );
    }).bind(this));

    var title = this.props.game.players.map(function (player) {
      var classes = ['gameBoard__player'];
      classes.push(players[player.name]);
      return React.createElement(
        'span',
        { className: classes.join(' ') },
        player.name
      );
    });

    var wrapperClasses = ['gameWrapper'];

    if (this.props.game.winner) {
      wrapperClasses.push('winner-' + players[this.props.game.winner]);
    }

    return React.createElement(
      'div',
      { className: wrapperClasses.join(' ') },
      React.createElement(
        'div',
        { className: 'gameTitle' },
        '/',
        this.props.game.id
      ),
      React.createElement(
        'div',
        { className: 'gameBoard' },
        columns
      ),
      React.createElement(
        'div',
        { className: 'gameTitle' },
        title[0],
        ' ',
        React.createElement(
          'span',
          { className: 'vs' },
          'vs.'
        ),
        title[1]
      )
    );
  }
});

