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
      return res.badRequest('Only a client socket can subscribe to Louies.  You, sir, appear to be something... _else_.');
    }
    //var socketId = sails.sockets.id(req.socket);
    var userId = req.session.me;
    Game.create({owner:userId}).exec(function createCB(err, newGame) {
      console.log('Created game with id ' + newGame.id)
      gamesInProgress[newGame.id] = new GameHandler(newGame.id);
      res.ok("ok");
    });
  },
  'start': function (req, res) {

    // Get the ID of the room to join
    var gameId = req.param('id');
    var userId = req.session.me;
    // Subscribe the requesting socket to the "message" context,
    // so it'll get notified whenever Room.message() is called
    // for this room.
    // First we'll find all users named "louie" (or "louis" even-- we should be thorough)
    Game.findOne({id: gameId,owner:userId}).exec(function (err, game) {
      if (err) {
        return res.negotiate(err);
      }

      var currentGame = gamesInProgress[game.id];
      currentGame.start();
      res.ok("ok");
    });
  }


};

