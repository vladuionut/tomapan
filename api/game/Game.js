/**
 * Created by ivladu on 1/5/2016.
 */
var Round = require('./Round.js');
function Game(id) {
  this.MAX_ROUNDS = 5;
  this.rounds = [];
  this.currentRound = null;
  this.id = id;
}

Game.prototype.start = function() {

  this.nextRound();
};

Game.prototype.roundEnd = function() {
  console.log('round ' + this.currentRound.id + 'end');
  this.nextRound();

};
Game.prototype.nextRound = function() {
  if (this.rounds.length <= this.MAX_ROUNDS) {
    this.currentRound = new Round(this.rounds.length + 1, this);
    this.rounds.push(this.currentRound);
    this.currentRound.start(this.roundEnd.bind(this));

  } else {
    this.endGame();
  }
};

Game.prototype.endGame = function() {
  console.log('endgame');
};

module.exports = Game;
