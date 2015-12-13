/**
 * Created by Vladu on 13.12.2015.
 */
define(function (require) {

  var Backbone = require("backbone"),
    userListView = require("app/views/UserListView");
  return Backbone.View.extend({
    initialize: function () {
      console.log("initialize view");
      this._nestedViews = {};
      this._nestedViews.userList = new userListView();
    },
    render: function () {
      this.$el.append(this._nestedViews.userList.render().el);
      return this;
    }

  });
});
