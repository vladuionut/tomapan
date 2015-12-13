/**
 * Created by Vladu on 13.12.2015.
 */
define(function (require) {

  var Backbone = require("backbone"),
   userListTpl = require("text!templates/userList.html"),
    userCollection = require("app/models/UserCollection");
  return Backbone.View.extend({
     className:"list-group",
    template: _.template(userListTpl),
    initialize: function () {
      this.collection = new userCollection();
      console.log("initialize view");
      this.collection.fetch();
      this.listenTo(this.collection,"sync update",this.render)
    },
    render: function () {

      this.$el.html(this.template({users:this.collection.toJSON()}));
      return this;
    }

  });


});
