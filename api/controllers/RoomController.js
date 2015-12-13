/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Join a chat room -- this is bound to 'post /room/:roomId/users'
  'join': function (req, res, next) {
    // Get the ID of the room to join
    var roomId = req.param('roomId');
    // Subscribe the requesting socket to the "message" context,
    // so it'll get notified whenever Room.message() is called
    // for this room.
    Room.subscribe(req, roomId, ['message']);
    // Continue processing the route, allowing the blueprint
    // to handle adding the user instance to the room's `users`
    // collection.
    return next();
  },

  // Leave a chat room -- this is bound to 'delete /room/:roomId/users'
  'leave': function (req, res, next) {
    // Get the ID of the room to join
    var roomId = req.param('roomId');
    // Unsubscribe the requesting socket from the "message" context
    Room.unsubscribe(req, roomId, ['message']);
    // Continue processing the route, allowing the blueprint
    // to handle removing the user instance from the room's
    // `users` collection.
    return next();
  },
  subscribeToFunRoom: function (req, res) {
    if (!req.isSocket) {
      return res.badRequest('Only a client socket can subscribe to Louies.  You, sir, appear to be something... _else_.');
    }

    // Get the ID of the room to join
    var roomId = req.param('roomId');
    var userId = req.param('userId');
    // Subscribe the requesting socket to the "message" context,
    // so it'll get notified whenever Room.message() is called
    // for this room.
    // First we'll find all users named "louie" (or "louis" even-- we should be thorough)
    User.findOne({id: userId}).exec(function (err, currentUser) {

      if (err) {
        return res.negotiate(err);
      }


      Room.findOne({id: roomId}).populate('users').exec(function (err, FoundedRoom) {
        if (err) {
          return res.negotiate(err);
        }

        FoundedRoom.users.add(userId);
        FoundedRoom.save(function (err, updatedRoom) {
          if (err) {
            return res.negotiate(err);
          }
          Room.subscribe(req, roomId, ['message']);
          return res.ok(updatedRoom);
        });


      });

    });
  }
};

