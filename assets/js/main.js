/**
 * Created by Vladu on 09.12.2015.
 */
requirejs.config({
baseUrl:"/js/lib",
paths:{
app:"../app",
bootstrap:"bootstrap/bootstrap",
  backbone:"backbone"
},
  shim:{
    bootstrap:{
      deps:['jquery']
    }
  }
});

//Then, later in a separate file, call it 'MyModel.js', a module is
//defined, specifying 'backbone' as a dependency. RequireJS will use
//the shim config to properly load 'backbone' and give a local
//reference to this module. The global Backbone will still exist on
//the page too.
define(['bootstrap',"backbone","sails.io.backbone"], function () {

  require(['app/models/UserModel'],function(model){

    console.log(model);
  });
});
