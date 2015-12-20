/**
 * Created by Vladu on 13.12.2015.
 */
define(function (require) {

  var Backbone = require("backbone"),
   roomsListTpl = require("text!templates/roomsList.html"),
   roomsCollection = require("app/models/RoomsCollection");
  return Backbone.View.extend({
     className:"list-rooms",
    template: _.template(roomsListTpl),
    initialize: function () {
      this.collection = new roomsCollection();
      console.log("initialize view");
      this.collection.fetch();
      this.listenTo(this.collection,"sync update",this.render)
    },
    render: function () {

      this.$el.html(this.template({rooms:this.collection.toJSON()}));
      return this;
    },
    events:{
      "click .joinButton":"joinRoom"

    },
    joinRoom:function(e){
      var roomId = $(e.currentTarget).data("id");
      io.socket.post('/room/'+roomId+"/join",  function (resData) {
        console.log(arguments);
      });

    }

  });


});
