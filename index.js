/**
 *
 * Connect Four as as Service (CFaaS)
 *
 */

const express = require('express');
const bodyParser = require('body-parser');
const Long = require('big-integer');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Game = require('./lib/models/game.js');
const gameView = require('./lib/views/game.js');

const Player = require('./lib/models/player.js');
const playerView = require('./lib/views/player.js');

const boardUtil = require('./lib/boardUtil.js');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// data storage
const DB = {};

// helpers
const allGames = function() {
  var games = [];
  var now = new Date().getTime();

  for (var game in DB) {
    games.push(DB[game]);
  }

  games = games.sort(function(a, b) {
    return a.created > b.created ? -1 : 1;
  });

  return games.filter(function(game) {
    return (now - game.created) < 60000;
  }).map(function(game) {
    return gameView(game);
  });
};

const notFound = function(res) {
  res.status(404).send({ error: 'not found' });
};

const playRound = function(game, col) {
  if (!game.makePlay(col)) {
    game.finish(game.otherPlayer());
    io.emit('games', allGames());
    return false;
  }
  if (boardUtil.isWon(game.currentPlayer.board)) {
    game.finish(game.currentPlayer);
    io.emit('games', allGames());
    return false;
  }
  if (boardUtil.isFull(game.board)) {
    game.finish();
    io.emit('games', allGames());
    return false;
  }
  return true;
}

// routes
app.get('/games', function(req, res) {
  res.send(allGames());
});

app.get('/games/:id', function(req, res) {
  var game = DB[req.params.id];

  if (!game) {
    return notFound(res);
  }

  return res.send(gameView(game));
});

app.post('/games', function(req, res) {
  var game    = new Game();
  DB[game.id] = game;

  io.emit('games', allGames());
  res.status(201).send(gameView(game));
});

app.post('/games/:id/players', function(req, res) {
  var game = DB[req.params.id];
  var player = new Player(req.body.name);

  if (!game) {
    return notFound(res);
  }

  if (game.isFull()) {
    return res.status(400).send({ error: 'game full' });
  }

  game.players.push(player);
  game.responses.push(res);

  if (req.body.match && game.players.length === 1) {
    var ai = new Player('bot', 'ai');
    game.players.push(ai);
  }

  if (game.isFull()) {
    game.start();
    game.responses.shift().send(gameView(game));
    game.startClock();
  }

  io.emit('games', allGames());
  req.on('close', function() {
    game.finish(game.currentPlayer);
  });
});

app.post('/games/:id/plays', function(req, res) {
  var game = DB[req.params.id];
  var col = req.body.col;
  var token = req.header('X-Token');

  if (!game) {
    return notFound(res);
  }

  if (token !== game.currentPlayer.token) {
    return res.status(400).send({ error: 'out of turn' });
  }

  if (!game.isActive()) {
    return res.status(400).send({ error: 'game not active' });
  }

  game.responses.push(res);
  if (!playRound(game, col)) { return; }

  game.startClock();
  game.currentPlayer = game.otherPlayer();

  if (!game.currentPlayer.isHuman()) {
    var moves = boardUtil.availableMoves(game.board);
    var move = moves[Math.floor(Math.random() * moves.length)];
    playRound(game, move[0]);
    game.startClock();
    game.currentPlayer = game.otherPlayer();
  }

  game.responses.shift().send(gameView(game));

  io.emit('games', allGames());
  req.on('close', function() {
    game.finish(game.currentPlayer);
  });
});

http.listen(3000, function() {
  console.log('listening on 3000');
});
