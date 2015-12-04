/**
 * Created by ivladu on 12/4/2015.
 */
$(function(){

  $.material.init();
  io.socket.on('connect', function(){
    io.socket.get('/user',function(){
      console.log(arguments);
    });
  });

  io.socket.on('disconnect', function(){
    console.log('Lost connection to server');
  });


});
