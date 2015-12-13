/*!

 IVL * * * http://ricostacruz.com/cheatsheets/umdjs.html



 * Backbone SDK for Sails and Socket.io
 * (override for Backbone.sync and Backbone.Collection)
 *
 * c. 2013 @mikermcneil
 * MIT Licensed
 *
 *
 * Inspired by:
 * backbone.iobind - Backbone.sync replacement
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
;
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone'], factory);
  } else if (typeof exports === 'object') {
    factory(require('backbone'));
  } else {
    factory(root.Backbone);
  }

}(this, function (Backbone) {

  // The active `socket`
  var socket;

  // Also keep track of where it came from
  var socketSrc;

  // Used to simplify app-level connection logic-- i.e. so you don't
  // have to wait for the socket to be connected to start trying to
  // synchronize data.
  var requestQueue = [];


  /**
   * _acquireSocket()
   *
   * Grab hold of our active socket object, set it on `socket` closure variable above.
   * (if your connected socket exists on a non-standard variable, change here)
   *
   * @api private
   */
  var _acquireSocket = function () {
    if (socket) return;

    if (Backbone.socket) {
      socket = Backbone.socket;
      socketSrc = 'Backbone.socket';
    }
    else if (window.socket) {
      socket = window.socket;
      socketSrc = 'window.socket';
    } else if (window.io) {
      socket = window.io.socket;
      socketSrc = 'window.io';
    }
  };


  var socketIsConnected = function () {
    return socket && socket._raw.connected;
  }


  /**
   * Checks if the socket is ready- if so, runs the request queue.
   * If not, sets the timer again.
   */
  var _keepTryingToRunRequestQueue = function () {
    io.socket.on('connect', function processRequest() {
      // Run the request queue
      _.each(requestQueue, function (request) {
        Backbone.sync(request.method, request.model, request.options);
      });
      io.socket.off('connect', processRequest);
      requestQueue = [];
    });

  };


  _acquireSocket();

  /**
   * # Backbone.sync
   *
   * Replaces default Backbone.sync function with socket.io transport
   *
   * @param {String} method
   * @param {Backbone.Model|Backbone.Collection} model
   * @param {Object} options
   *
   * @name sync
   */
  Backbone.sync = function (method, model, options) {

    // Clone options to avoid smashing anything unexpected
    options = _.extend({}, options);


    // If socket is not defined yet, try to grab it again.
    _acquireSocket();


    // Handle missing socket
    if (!socket) {
      throw new Error(
        '\n' +
        'Backbone cannot find a suitable `socket` object.\n' +
        'This SDK expects the active socket to be located at `window.socket`, ' +
        '`Backbone.socket` or the `socket` property\n' +
        'of the Backbone model or collection attempting to communicate w/ the server.\n'
      );
    }


    // Ensures the socket is connected and able to communicate w/ the server.
    //

    if (!socketIsConnected()) {

      // If the socket is not connected, the request is queued
      // (so it can be replayed when the socket comes online.)
      requestQueue.push({
        method: method,
        model: model,
        options: options
      });


      // If we haven't already, start polling the socket to see if it's ready
      _keepTryingToRunRequestQueue();

      return;
    }


    // Get the actual URL (call `.url()` if it's a function)
    var url;
    if (options.url) {
      url = _.result(options, 'url');
    }
    else if (model.url) {
      url = _.result(model, 'url');
    }
    // Throw an error when a URL is needed, and none is supplied.
    // Copied from backbone.js#1558
    else throw new Error('A "url" property or function must be specified');


    // Build parameters to send to the server
    var params = {};

    if (!options.data && model) {
      params = options.attrs || model.toJSON(options) || {};
    }

    if (options.patch === true && _.isObject(options.data) && options.data.id === null && model) {
      params.id = model.id;
    }

    if (_.isObject(options.data)) {
      _(params).extend(options.data);
    }


    // Map Backbone's concept of CRUD methods to HTTP verbs
    var verb;
    switch (method) {
      case 'create':
        verb = 'post';
        break;
      case 'read':
        verb = 'get';
        break;
      case 'update':
        verb = 'put';
        break;
      default:
        verb = method;
    }


    var requestOptions = {};
    requestOptions.url = url;
    requestOptions.method = verb;
    requestOptions.params = params;

    // Send a simulated HTTP request to Sails via Socket.io
    var simulatedXHR =
      socket.request(requestOptions, function serverResponded(response, status) {
        if (status.statusCode == 200) {
          if (options.success) options.success(response);
        } else {
          console.error("Server error", status.statusCode, status.error);
        }

      }, verb);


    // Trigget the `request` event on the Backbone model
    model.trigger('request', model, simulatedXHR, options);


    return simulatedXHR;
  };


  /**
   *  eventIdentity  string  The unique identity of a server-sent event, e.g. "recipe"
   *  callback  function  Will be called when the server emits a message to this socket.
   */
  Backbone.Collection.prototype.listenSocket = function (eventIdentity) {
    eventIdentity = eventIdentity || this.url.replace("/", "");
    var model = this;
    socket.on(eventIdentity, function (response) {

      // Let's see what the server has to say...
      switch (response.verb) {

        case 'created':
          model.add(response.data); // (add the new order to the DOM)
          break;

        default:
          return;
      }
    });
  }

}));

