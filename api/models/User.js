/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    avatar: {
      type: 'string',
      required: false
    },
    status: {
      type: 'string',
      defaultsTo: 'offline',
      required: false
    },
    ip: {
      type: 'string',
      required: false
    },
    rooms: {
      collection: 'room',
      via: 'users',
      dominant: true
    },
    // Override the default toJSON method

    toJSON: function() {
      var obj = this.toObject();

      return {
        name:obj.name,
        avatar:obj.avatar,
        id:obj.id
      }
    }
  },
  signup: function (inputs, cb) {

    var password = inputs.password;
    var hasher = require("password-hash");
    password = hasher.generate(password);

    // Create a user
    User.create({
        name: inputs.name,
        email: inputs.email,
        password: password,
        avatar: inputs.avatar
      }
    ).
    exec(cb);
  },

  attemptLogin: function (inputs, cb) {

    // Create a user
    User.findOne({
        email: inputs.email
      })
      .exec(cb);
  }
};

