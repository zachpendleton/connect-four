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
});

app.post('/games/:id/plays', function(req, res) {
});

http.listen(3000, function() {
  console.log('listening on 3000');
});
