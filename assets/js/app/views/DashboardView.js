/**
 * Created by Vladu on 13.12.2015.
 */
define(function (require) {

  var Backbone = require("backbone"),
    dashBoardTpl = require("text!templates/dashboard.html"),
    SidebarView = require("app/views/Sidebarview"),
    RoomsListView = require("app/views/RoomsListView"),
    BackboneModal = require("backbone.bootstrap-modal"),
    CreateRoomView = require("app/views/CreateRoomView");
  return Backbone.View.extend({
    el: "#dashboard",
    template: _.template(dashBoardTpl),
    initialize: function () {
      console.log("initialize view");
      this._nestedViews = {};
      this._nestedViews.sidebar = new SidebarView();
      this._nestedViews.roomsList = new RoomsListView();
    },
    render: function () {
      this.$el.html(this.template());

      this.$("#dashboard_sidebar").html(this._nestedViews.sidebar.render().el);

      this.$("#roomsList").html(this._nestedViews.roomsList.render().el);


      return this;
    },
    events: {
      "click #create_room": "createRoom"

    },
    createRoom: function () {
      var modal = new BackboneModal({content: new CreateRoomView()});
      modal.open();
    }
  });


});
