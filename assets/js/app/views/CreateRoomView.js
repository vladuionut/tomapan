/**
 * Created by ivladu on 12/18/2015.
 */
define(function (require) {
  var Backbone = require("backbone"),
    createRoomTpl = require("text!templates/createRoom.html"),
    RoomModel = require("app/models/RoomModel");

    return Backbone.View.extend({
    initialize: function () {
      this.bind("ok", this.okClicked);
    },
    template: _.template(createRoomTpl),
    render: function () {
      this.$el.html(this.template());
    },
    okClicked: function (modal) {
      var room = new RoomModel({
        time:this.$("#time").val(),
        rounds:this.$("#runde").val()

      });
      room.save(null).then(function(){

      });
      alert("Ok was clicked");
      modal.preventClose();
    }
  });


});
