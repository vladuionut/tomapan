/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var GameHandler = require("../game/Game.js");

var gamesInProgress = [];

module.exports = {
  'create': function (req, res) {
    if (!req.isSocket) {
      return res.badRequest('Only a client socket can make this request');
    }
    //var socketId = sails.sockets.id(req.socket);
    var userId = req.session.me;
    Game.create({owner:userId}).exec(function createCB(err, newGame) {
      console.log('Created game with id ' + newGame.id)
      gamesInProgress[newGame.id] = new GameHandler(newGame.id);
      res.ok(newGame);
    });
  },
  'start': function (req, res) {

    var gameId = req.param('id');
    var userId = req.session.me;

    Game.findOne({id: gameId,owner:userId}).exec(function (err, game) {
      if (err) {
        return res.negotiate(err);
      }

      var currentGame = gamesInProgress[game.id];
      if (!currentGame){
        game.status = "ended";
        game.save();
        var error = "this game doesn't exist or is already finished";
        return res.serverError(error);
      }
      currentGame.start();

      res.ok("ok");
    });
  },
  'endRound': function (req, res) {

    var gameId = req.param('id');
    var userId = req.session.me;

    Game.findOne({id: gameId,owner:userId}).exec(function (err, game) {
      if (err) {
        return res.negotiate(err);
      }

      var currentGame = gamesInProgress[game.id];
      currentGame.endRoundBeforeTime();
      res.ok("ok");
    });
  }


};

