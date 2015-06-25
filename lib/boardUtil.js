const Long = require('big-integer');

module.exports = {
  y: function(board, x) {
    for (var i = 0; i < 5; i++) {
      if (board.and(Long(1).shiftLeft((x * 7) + i)).equals(0)) {
        return i;
      }
    }
  },

  insert: function(board, x, y) {
    y = (y || this.y(board, x));
    return board.or(Long(1).shiftLeft((x * 7) + y));
  },

  bits: function() {
    var bits = [];

    for (var i = 5; i > -1; i--) {
      for (var j = 0; j < 44; j = j + 7) {
        bits.push(i + j);
      }
    }

    return bits;
  },

  isFull: function(board) {
    return this.bits().filter(function(bit) {
      return board.and(Long(1).shiftLeft(bit)).equals(0);
    }).length === 0;
  },

  checkBit: function(c, x) {
    return Long(c).and(Long(c).shiftRight(x));
  },

  checkFour: function(board) {
    return [6, 7, 8, 1].map(function(n) {
      return this.checkBit(this.checkBit(board, n), n * 2);
    }.bind(this));
  },

  checkThree: function(board) {
    return [6, 7, 8, 1].map(function(n) {
      return this.checkBit(this.checkBit(board, n), n);
    }.bind(this));
  },

  checkTwo: function(board) {
    return [6, 7, 8, 1].map(function(n) {
      return this.checkBit(board, n);
    }.bind(this));
  },

  isWon: function(board) {
    var out = Long();

    this.checkFour(board).forEach(function(n) {
      out = out.or(Long(n));
    });

    return out.value > 0;
  }
};
