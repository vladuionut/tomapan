/**
 * Created by Vladu on 09.12.2015.
 */
requirejs.config({
  baseUrl: "/js/lib",
  paths: {
    app: "../app",
    templates: "../../templates",
    bootstrap: "bootstrap/bootstrap",
    backbone: "backbone"
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    }
  }
});

define(['bootstrap', "backbone", "sails.io.backbone"], function () {

  require(['backbone', 'app/router'], function (Backbone, router) {
    new router();
    Backbone.history.start();
  });
});
