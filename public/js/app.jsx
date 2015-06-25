var Dashboard = React.createClass({
  render: function() {
    var games = this.props.games.map(function(game) {
      var key = 'game-' + game.id;
      return (
        <Board game={game} key={key} />
      );
    });
    return (
      <div className="gameDashboard">
        {games}
      </div>
    );
  }
});

var Board = React.createClass({
  players: function() {
    var out  = {};
    var keys = ['x', 'o'];
    this.props.game.players.forEach(function(p) {
      out[p.name] = keys.shift();
    });
    return out;
  },

  render: function() {
    var players = this.players();
    var board   = this.props.game.boardViz;
    
    var columns  = board.map(function(col, i) {
      var key = ['game', this.props.game.id, 'col', i];
      var tokens = col.reverse().map(function(token, j) {
        var classes = ['token'];
        var key = ['game', this.props.game.id, 'col', i, 'token', j];
        
        for (var player in players) {
          if (token === player) classes.push(players[player]);
        }
                
        return (
          <div className={classes.join(' ')} key={key.join('-')}></div>
        );
      }.bind(this));
      
      return (
        <div className="gameBoard__column" key={key.join('-')}>
          {tokens}
        </div>
      );
    }.bind(this));
    
    var title = this.props.game.players.map(function(player) {
      var classes = ["gameBoard__player"];
      classes.push(players[player.name]);
      return (
        <span className={classes.join(' ')}>
          {player.name}
        </span>
      );
    });
    
    var wrapperClasses = ['gameWrapper'];
    
    if (this.props.game.winner) {
      wrapperClasses.push('winner-' + players[this.props.game.winner]);
    }
        
    return (
      <div className={wrapperClasses.join(' ')}>
        <div className="gameTitle">
          /{this.props.game.id}
        </div>
        <div className="gameBoard">
          {columns}
        </div>
        <div className="gameTitle">
          {title[0]} <span className="vs">vs.</span>
          {title[1]}
        </div>
      </div>
    );
  }
})