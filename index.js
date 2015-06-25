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

// routes
app.get('/games', function(req, res) {
  var games = [];

  for (var game in DB) {
    games.push(gameView(DB[game]));
  }

  res.send(games);
});

app.get('/games/:id', function(req, res) {
  var game = DB[req.params.id];

  if (!game) {
    return res.send({ error: 'game not found' });
  }

  return res.send(gameView(game));
});

app.post('/games', function(req, res) {
  var game    = new Game();
  DB[game.id] = game;

  return res.send(gameView(game));
});

app.post('/games/:id/players', function(req, res) {
  var game = DB[req.params.id];
  var player = new Player(req.body.name);

  if (game.isFull()) {
    return res.send({ error: 'game full' });
  }

  game.players.push(player);
  game.responses.push(res);

  if (game.isFull()) {
    game.start();
    game.responses.shift().send(gameView(game));
    game.startClock();
  }

  req.on('close', function() {
    game.finish(game.currentPlayer);
  });
});

app.post('/games/:id/plays', function(req, res) {
  var game = DB[req.params.id];
  var col = req.body.col;
  var token = req.header('X-Token');

  if (token !== game.currentPlayer.token) {
    return res.status(400).send({ error: 'out of turn' });
  }

  if (!game.isActive()) {
    return res.status(400).send({ error: 'game not active' });
  }

  game.responses.push(res);
  if (!game.makePlay(col)) { return game.finish(game.otherPlayer()); }
  if (boardUtil.isWon(game.currentPlayer.board)) { return game.finish(game.currentPlayer); }
  if (boardUtil.isFull(game.board)) { return game.finish(); }

  game.startClock();
  game.currentPlayer = game.otherPlayer();
  game.responses.shift().send(gameView(game));

  req.on('close', function() {
    game.finish(game.currentPlayer);
  });
});

http.listen(3000, function() {
  console.log('listening on 3000');
});
