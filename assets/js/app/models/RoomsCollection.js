/**
 * Created by Vladu on 09.12.2015.
 */
define(function (require) {
    var Backbone = require("backbone");
  return Backbone.Collection.extend({
  url:"/room",
    initialize:function(){
      this.listenSocket();
    }

  });
});
