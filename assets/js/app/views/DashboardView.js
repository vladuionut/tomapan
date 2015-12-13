/**
 * Created by Vladu on 13.12.2015.
 */
define(function (require) {

  var Backbone = require("backbone");
  var dashBoardTpl = require("text!templates/dashboard.html"),
     SidebarView = require("app/views/Sidebarview");
  return Backbone.View.extend({
    el: "#dashboard",
    template: _.template(dashBoardTpl),
    initialize: function () {
      console.log("initialize view");
      this._nestedViews = {};
      this._nestedViews.sidebar = new SidebarView();
    },
    render: function () {
      this.$el.html(this.template());

      this.$("#dashboard_sidebar").html(this._nestedViews.sidebar.render().el);
      return this;
    }

  });


});
