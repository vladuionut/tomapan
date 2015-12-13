/**
 * Created by Vladu on 13.12.2015.
 */
define(function (require) {
  var Backbone = require("backbone"),
    dashBoardView = require("app/views/DashboardView");
  return Backbone.Router.extend({

    routes: {
      "": "home",
      "help": "help",    // #help
      "search/:query": "search",  // #search/kiwis
      "search/:query/p:page": "search"   // #search/kiwis/p7
    },
    home: function () {
      var view = new dashBoardView();
      view.render();
    },
    help: function () {
      console.log("help");

    },

    search: function (query, page) {
      console.log("search");
    }

  });
});
