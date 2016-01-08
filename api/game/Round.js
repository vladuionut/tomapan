/**
 * Created by ivladu on 1/5/2016.
 */

function Round(id, game) {
  this.startTime = new Date();
  this.ROUNDTIME = 45;
  this.id = id;
  this.game = game;
  this.endTime = this.startTime.getTime()+this.ROUNDTIME*1000;

};
/**
 *
 * @param cb -- callback when the round is finished
 */
Round.prototype.start = function (cb) {
  this.timerId = setTimeout(cb || this.onTimeOut,this.ROUNDTIME*1000);
}
Round.prototype.stop = function(cb){
  clearTimeout(this.timerId);
  if (typeof cb === "function"){
    cb.call();
  }
}

Round.prototype.onTimeOut = function(){
  console.log("runda terminata");

}

module.exports = Round;
